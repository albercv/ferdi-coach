import path from "node:path"

import type { MediaScope, ProductMediaSubscope } from "./paths"
import { resolveUploadDir } from "./paths"
import { buildUniqueFilename, getSafeExt } from "./filename"
import { validateUploadMeta } from "./validation"
import { countUrlReferencesInContent } from "./reference-scan"
import { LocalPublicStorage } from "./storage/LocalPublicStorage"
import type {
  ListObject,
  StorageAdapter,
} from "./storage/StorageAdapter"

export type UploadInput = {
  bytes: Uint8Array
  originalName: string
  mimeType?: string
  sizeBytes: number
  scope: MediaScope
  entitySlug?: string
  productSubscope?: ProductMediaSubscope
}

export type UploadResult = {
  url: string
  size: number
  mimeType?: string
  kind: "image" | "video" | "document"
}

export class MediaService {
  private readonly storage: StorageAdapter
  private readonly contentRoot: string

  constructor(args?: { storage?: StorageAdapter; contentRoot?: string }) {
    this.storage = args?.storage ?? new LocalPublicStorage()
    this.contentRoot = args?.contentRoot ?? path.join(process.cwd(), "content")
  }

  async upload(input: UploadInput): Promise<UploadResult> {
    const dirRelToPublic = resolveUploadDir({
      scope: input.scope,
      entitySlug: input.entitySlug,
      productSubscope: input.productSubscope,
    })

    getSafeExt(input.originalName)

    const { kind } = validateUploadMeta({
      ext: input.originalName,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
    })

    const filename = buildUniqueFilename(input.originalName)
    const stored = await this.storage.save({
      bytes: input.bytes,
      dirRelToPublic,
      filename,
      mimeType: input.mimeType,
    })

    return {
      url: stored.url,
      size: stored.size,
      mimeType: stored.mimeType,
      kind,
    }
  }

  async tryDeleteIfUnreferenced(
    url: string,
  ): Promise<{ deleted: boolean; reason?: string }> {
    if (!url.startsWith("/uploads/")) {
      return { deleted: false, reason: "not-local-upload" }
    }

    const refs = await countUrlReferencesInContent({
      contentRoot: this.contentRoot,
      url,
    })

    if (refs > 0) {
      return { deleted: false, reason: "still-referenced" }
    }

    const deleted = await this.storage.deleteByUrl(url)
    if (!deleted) {
      return { deleted: false, reason: "not-found" }
    }

    return { deleted: true }
  }

  async list(prefixUrl: string): Promise<ListObject[]> {
    return this.storage.list(prefixUrl)
  }
}
