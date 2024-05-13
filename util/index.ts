export function isEmpty(str: string) {
    return str.length <= 0;
}

export function getStars(rating: number) {
    rating /= 2.0
    return '★'.repeat(Math.floor(rating)) + ((rating - Math.floor(rating)) !== 0 ? '½' : '')
}