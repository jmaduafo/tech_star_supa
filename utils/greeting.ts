export function greeting() {
    const date = new Date()
    let greeting = ""

    if (date.getHours() >= 0 && date.getHours() < 12) {
        greeting += "morning"
    } 
    else if (date.getHours() >= 12 && date.getHours() < 17) {
        greeting += "afternoon"
    }
    else if (date.getHours() >= 17 && date.getHours() <= 23) {
        greeting += "evening"
    }

    return greeting
}