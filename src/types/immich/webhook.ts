export interface ImmichWebhookData {
  type: string | null
  trigger: string | null
  data: Data
}

export interface Data {
  asset: ImmichAsset
}

export interface ImmichAsset {
  id: string | null
  ownerId: string | null
  stackId: string | null
  livePhotoVideoId: string | null
  libraryId: string | null
  duplicateId: string | null
  createdAt: string | null
  updatedAt: string | null
  deletedAt: string | null
  fileCreatedAt: string | null
  fileModifiedAt: string | null
  localDateTime: string | null
  type: string | null
  status: string | null
  visibility: string | null
  duration: string | null
  checksum: Checksum
  originalPath: string | null
  originalFileName: string | null
  isOffline: boolean
  isFavorite: boolean
  isExternal: boolean
  isEdited: boolean
  exifInfo: ExifInfo
}

export interface Checksum {
  type: string | null
  data: number[]
}

export interface ExifInfo {
  make: string | null
  model: string | null
  orientation: string | null
  dateTimeOriginal: string | null
  modifyDate: string | null
  exifImageWidth: number
  exifImageHeight: number
  fileSizeInByte: number
  lensModel: string | null
  fNumber: string | null
  focalLength: string | null
  iso: string | null
  latitude: string | null
  longitude: string | null
  city: string | null
  state: string | null
  country: string | null
  description: string | null
  fps: string | null
  exposureTime: string | null
  livePhotoCID: string | null
  timeZone: string | null
  projectionType: string | null
  profileDescription: string | null
  colorspace: string | null
  bitsPerSample: number
  autoStackId: string | null
  rating: string | null
  tags: string | null
  updatedAt: string | null
}
