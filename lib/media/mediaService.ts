import path from "node:path"

import type { MediaScope, ProductMediaSubscope } from "./paths"
import { resolveUploadDir } from "./paths"
import { buildUniqueFilename, getSafeExt } from "./filename"
import { validateUploadMeta } from "./validation"
import { countUrlReferencesInContent } from "./reference-scan"
import {
  countTerminalSubmissionRefsMatchingFileUrl,
  listActiveSubmissionsReferencingFileUrl,
} from "@/lib/payments-storage"
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
    const envContentDir = process.env.CONTENT_DIR?.trim()
    const resolvedContentDir = envContentDir
      ? (path.isAbsolute(envContentDir) ? envContentDir : path.join(process.cwd(), envContentDir))
      : path.join(process.cwd(), "content")

    this.contentRoot = args?.contentRoot ?? resolvedContentDir
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

    // Cuenta TODAS las referencias en content/**. Incluye product .md, submissions
    // activas y submissions terminales (confirmed/failed).
    const totalRefs = await countUrlReferencesInContent({
      contentRoot: this.contentRoot,
      url,
    })

    if (totalRefs > 0) {
      // Hay al menos una referencia. Las submissions activas (pending, overdue,
      // failed_warning) tienen que bloquear el borrado porque el fichero aún se
      // va a entregar. Las submissions terminales (confirmed, failed) NO bloquean
      // porque la entrega ya se hizo o se canceló.
      const activeSubmissions = listActiveSubmissionsReferencingFileUrl(url)
      if (activeSubmissions.length > 0) {
        return { deleted: false, reason: "referenced-by-active-payments" }
      }

      // Si llegan más refs que las que viven SÓLO en submissions terminales,
      // significa que algún otro .md (p.ej. el producto visible) sigue usando
      // el fichero. Mantenemos el bloqueo.
      const terminalSubmissionRefs = countTerminalSubmissionRefsMatchingFileUrl(url)
      if (totalRefs > terminalSubmissionRefs) {
        return { deleted: false, reason: "still-referenced" }
      }
      // else: todas las referencias son submissions terminales → podemos borrar
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
