export function dataToOptions(data): any[] {
  try {
    return data.map((row) => ({
      label: row,
      value: row
    }))
  } catch (e) {
    console.error(e)
    return []
  }
}
