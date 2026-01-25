export type StoredObject = Readonly<{
  url: string
  size: number
  mimeType?: string
}>

export type ListObject = Readonly<{
  url: string
  size: number
  mimeType?: string
  lastModifiedMs: number
}>

export interface StorageAdapter {
  save(args: {
    bytes: Uint8Array
    dirRelToPublic: string
    filename: string
    mimeType?: string
  }): Promise<StoredObject>

  deleteByUrl(url: string): Promise<boolean>
  list(prefixUrl: string): Promise<ListObject[]>
}
