export function parseBoolean(field) {
  return typeof field === 'boolean' ? (field ? 'Yes' : 'No') : 'n/a'
}

export function parsePercent(field, fixed = 2) {
  const value = field || 0
  return !field
    ? 'n/a'
    : value || value.toString() === '0'
    ? `${Number(value).toFixed(fixed)}%`
    : 'n/a'
}
