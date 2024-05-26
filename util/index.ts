import { jwtDecode } from "jwt-decode";

export function isEmpty(str: string) {
    return str.length <= 0;
}

export function getStars(rating: number) {
    rating /= 2.0
    return '★'.repeat(Math.floor(rating)) + ((rating - Math.floor(rating)) !== 0 ? '½' : '')
}

export function formatArrAsSentence(arr: Array<any>) {
    if (!arr || arr.length === 0) {
        return ''
    }
    else if (arr.length === 1) {
        return `${arr[0]}`
    }
    else if (arr.length === 2) {
        return `${arr[0]} and ${arr[1]}`
    }
    else {
        let out = `${arr[0]}, `
        for (let i = 1; i < arr.length; i++) {
            if (i === arr.length - 2) {
                out += `${arr[i-1]} and ${arr[i]}`
                break;
            }
            out += `${arr[i]}, `
        }
        return out
    }
}

const ops: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
}

export function strToDate(s: string) {
    return new Date(s).toLocaleDateString('en-US', ops)
}

export function isUserValid(token: string | undefined | null, username: string) {
    if (token) {
        const decoded: any = jwtDecode(token)
        if (decoded.username === username) {
            return true
        }
    }
    return false
}