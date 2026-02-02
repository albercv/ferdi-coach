import fs from "node:fs/promises"
import path from "node:path"

async function walkMdFiles(root: string): Promise<string[]> {
  const entries = await fs.readdir(root, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const entryAbs = path.join(root, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await walkMdFiles(entryAbs)))
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      files.push(entryAbs)
    }
  }

  return files
}

function countOccurrences(haystack: string, needle: string): number {
  if (!needle) return 0
  let count = 0
  let idx = 0
  while (true) {
    const found = haystack.indexOf(needle, idx)
    if (found === -1) break
    count += 1
    idx = found + needle.length
  }
  return count
}

export async function countUrlReferencesInContent(args: {
  contentRoot?: string
  url: string
}): Promise<number> {
  const url = args.url
  if (!url || !url.startsWith("/")) {
    throw new Error("url must be a non-empty string starting with '/' ")
  }

  const contentRoot = args.contentRoot ?? path.join(process.cwd(), "content")

  let contentStat: Awaited<ReturnType<typeof fs.stat>>
  try {
    contentStat = await fs.stat(contentRoot)
  } catch (err) {
    const nodeErr = err as NodeJS.ErrnoException
    if (nodeErr?.code === "ENOENT") {
      return 0
    }
    throw err
  }

  if (!contentStat.isDirectory()) {
    return 0
  }

  const mdFiles = await walkMdFiles(contentRoot)
  const contents = await Promise.all(mdFiles.map((file) => fs.readFile(file, "utf8")))
  return contents.reduce((acc, text) => acc + countOccurrences(text, url), 0)
}
