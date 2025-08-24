export function getInitials(fullName: string | undefined) {
  if (!fullName) {
    return "??";
  }

  const split = fullName.split(" ");
  const firstInit = split[0].charAt(0).toUpperCase();
  const lastInit = split[1].charAt(0).toUpperCase();

  return `${firstInit}${lastInit}`;
}

export function getFullName(firstName: string, lastName: string) {
// Output: John Doe
  return `${firstName.charAt(0).toUpperCase()}${firstName
    .slice(1)
    .toLowerCase()} ${lastName.charAt(0).toUpperCase()}${lastName
    .slice(1)
    .toLowerCase()}`;
}
