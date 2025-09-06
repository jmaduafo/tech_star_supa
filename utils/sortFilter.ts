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

