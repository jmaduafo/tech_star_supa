export function sortDate(arr: any[], key: string, asc: boolean) {
  const data = arr.toSorted((a, b) => {
    const dateA = new Date(a[key]);
    const dateB = new Date(b[key]);

    return asc
      ? dateA.getTime() - dateB.getTime()
      : dateB.getTime() - dateA.getTime();
  });

  return data
}

export function sortByNumOrBool(arr: any[], key: string, order: "asc" | "desc") {
  const data = arr.toSorted((a, b) => {

    return order === "asc"
      ? a[key] - b[key]
      : b[key] - a[key];
  });

  console.log(data)

  return data
}

export function sortByString(arr: any[], key: string, order: "asc" | "desc") {
  const data = arr.toSorted((a, b) => {

    return order === "asc"
      ? a[key].localeCompare(b[key])
      : b[key].localeCompare(a[key]);
  });

  console.log(data)

  return data
}

export function dateRangeFilter(item: string, range: string) {
  let days = 0

  if (range === "Last 1 year".toLowerCase()) {
    days = 365
  } else if (range === "Last 1 month".toLowerCase()) {
    days = 28
  } else if (range === "Last week".toLowerCase()) {
    days = 7
  }

  const date = new Date()
  const itemDate = new Date(item)

  let today = new Date(date)
  today.setDate(today.getDate() - days)

  return itemDate >= today
}

