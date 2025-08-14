export function getInitials(fullName: string | undefined) {
    if (!fullName) {
        return "??"
    }
    
    const split = fullName.split(' ')
    const firstInit = split[0].charAt(0).toUpperCase()
    const lastInit = split[1].charAt(0).toUpperCase()

    return `${firstInit}${lastInit}`
}