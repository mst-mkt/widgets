export const filePath = (value: string) => {
  if (value.startsWith('file://')) return value.slice('file://'.length)
  if (value.startsWith('/')) return value
  return null
}
