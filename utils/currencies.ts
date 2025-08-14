export function convertCurrency (labelValue : number) {
    let output = ""
    // Nine Zeroes for Billions
    if (Math.abs(Number(labelValue)) >= 1.0e+9) {
        output += (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2) + "B"
    } else if (Math.abs(Number(labelValue)) >= 1.0e+6) {
        output += (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + "M"
    } else if (Math.abs(Number(labelValue)) >= 1.0e+3) {
        output += (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + "K"
    } else {
        output += Math.abs(Number(labelValue))
    }

    return output
}

export function totalSum(arr: number[]) {
    let total = 0

    arr.forEach(i => {
        total = i + total
    })

    return total
}

export function formatCurrency(num: number, code: string) {
    if (num.toString().length < 16) {
        return new Intl.NumberFormat("en-US", { style: "currency", currency: code }).format(num)
    }
}