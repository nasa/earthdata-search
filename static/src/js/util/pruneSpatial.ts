export type DataWithSpatial = {
  boundingBox: string[],
  circle: string[],
  line: string[],
  point: string[],
  polygon: string[]
}

/**
 * Prunes the data object by removing empty spatial arrays.
 * @param data - The data object to prune.
 */
export const pruneSpatial = (data: DataWithSpatial): Partial<DataWithSpatial> => ({
  ...data,
  boundingBox: data.boundingBox?.length > 0 ? data.boundingBox : undefined,
  circle: data.circle?.length > 0 ? data.circle : undefined,
  line: data.line?.length > 0 ? data.line : undefined,
  point: data.point?.length > 0 ? data.point : undefined,
  polygon: data.polygon?.length > 0 ? data.polygon : undefined
})
