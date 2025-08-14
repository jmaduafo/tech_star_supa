export function isValidPassword(password: string) {
    // "Password length is too short. Must be at least 6 characters"
    if (password.length <= 6) {
        return false
    }

    return true
}

export function isValidEmail(email: string) {
    // "Email format does not match appropriate format"

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
        return false
    }

    return true
}