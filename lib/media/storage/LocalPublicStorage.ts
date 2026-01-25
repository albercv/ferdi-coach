import fs from "node:fs/promises"
import path from "node:path"

import type {
  ListObject,
  StorageAdapter,
  StoredObject,
} from "./StorageAdapter"

function assertSafeFilename(filename: string): void {
  if (filename.includes("/") || filename.includes("\\") || filename.includes("..")) {
    throw new Error("filename must not contain '/', '\\', or '..'")
  }
}

function assertSafeDirRelToPublic(dirRelToPublic: string): void {
  if (!dirRelToPublic.startsWith("uploads/")) {
    throw new Error("dirRelToPublic must start with 'uploads/'")
  }

  if (dirRelToPublic.includes("\\") || dirRelToPublic.includes("..")) {
    throw new Error("dirRelToPublic must not contain '\\' or '..'")
  }
}

function assertSafeUploadsUrl(url: string): string {
  const decodedUrl = decodeURIComponent(url)

  if (decodedUrl.includes("..") || decodedUrl.includes("\\")) {
    throw new Error("url must not contain '..' or '\\'")
  }

  if (decodedUrl !== "/uploads" && !decodedUrl.startsWith("/uploads/")) {
    throw new Error("url must start with '/uploads' or '/uploads/'")
  }

  return decodedUrl
}

function toPosixPath(p: string): string {
  return p.split(path.sep).join(path.posix.sep)
}

async function walkFilesRecursive(dirAbs: string): Promise<string[]> {
  const entries = await fs.readdir(dirAbs, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const entryAbs = path.join(dirAbs, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await walkFilesRecursive(entryAbs)))
    } else if (entry.isFile()) {
      files.push(entryAbs)
    }
  }

  return files
}

export class LocalPublicStorage implements StorageAdapter {
  private readonly publicDir: string

  constructor(args?: { publicDir?: string }) {
    this.publicDir = args?.publicDir ?? path.join(process.cwd(), "public")
  }

  private resolveUploadsPathFromUrl(urlOrPrefix: string): string {
    const decodedUrl = assertSafeUploadsUrl(urlOrPrefix)

    const relPathFromPublic = decodedUrl.startsWith("/") ? decodedUrl.slice(1) : decodedUrl
    const resolvedPath = path.resolve(this.publicDir, relPathFromPublic)
    const uploadsRootAbs = path.resolve(this.publicDir, "uploads")

    if (resolvedPath !== uploadsRootAbs && !resolvedPath.startsWith(uploadsRootAbs + path.sep)) {
      throw new Error("Resolved path must stay within public/uploads")
    }

    return resolvedPath
  }

  async save(args: {
    bytes: Uint8Array
    dirRelToPublic: string
    filename: string
    mimeType?: string
  }): Promise<StoredObject> {
    assertSafeDirRelToPublic(args.dirRelToPublic)
    assertSafeFilename(args.filename)

    const destDirAbs = this.resolveUploadsPathFromUrl("/" + args.dirRelToPublic)

    const filePathAbs = path.resolve(destDirAbs, args.filename)
    if (!filePathAbs.startsWith(destDirAbs + path.sep)) {
      throw new Error("Destination file path must stay within destination directory")
    }

    await fs.mkdir(destDirAbs, { recursive: true })
    await fs.writeFile(filePathAbs, args.bytes)

    const url = "/" + path.posix.join(args.dirRelToPublic, args.filename)

    return {
      url,
      size: args.bytes.byteLength,
      mimeType: args.mimeType,
    }
  }

  async deleteByUrl(_url: string): Promise<boolean> {
    const resolvedPath = this.resolveUploadsPathFromUrl(_url)

    let stat: Awaited<ReturnType<typeof fs.stat>>
    try {
      stat = await fs.stat(resolvedPath)
    } catch (err) {
      const nodeErr = err as NodeJS.ErrnoException
      if (nodeErr?.code === "ENOENT") {
        return false
      }
      throw err
    }

    if (stat.isDirectory()) {
      throw new Error("Refusing to delete a directory")
    }

    await fs.unlink(resolvedPath)
    return true
  }

  async list(_prefixUrl: string): Promise<ListObject[]> {
    const resolvedDir = this.resolveUploadsPathFromUrl(_prefixUrl)

    let dirStat: Awaited<ReturnType<typeof fs.stat>>
    try {
      dirStat = await fs.stat(resolvedDir)
    } catch (err) {
      const nodeErr = err as NodeJS.ErrnoException
      if (nodeErr?.code === "ENOENT") {
        return []
      }
      throw err
    }

    if (!dirStat.isDirectory()) {
      return []
    }

    const filePaths = await walkFilesRecursive(resolvedDir)

    const objects = await Promise.all(
      filePaths.map(async (fileAbs) => {
        const stat = await fs.stat(fileAbs)
        const rel = path.relative(this.publicDir, fileAbs)
        const url = "/" + path.posix.join(...toPosixPath(rel).split(path.posix.sep))
        return {
          url,
          size: stat.size,
          lastModifiedMs: stat.mtimeMs,
        } satisfies ListObject
      }),
    )

    objects.sort((a, b) => a.url.localeCompare(b.url))
    return objects
  }
}
