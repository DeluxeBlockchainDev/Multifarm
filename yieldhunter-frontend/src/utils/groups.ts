export function groupsToOptions(groups) {
  const options: any[] = []

  Object.keys(groups).forEach((key) => {
    options.push({ label: groups[key]['display_name'], value: key })
  })

  return options
}
