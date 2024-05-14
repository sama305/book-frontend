const baseUrl = 'https://www.googleapis.com/books/v1/volumes'

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const query = body.query.split('').map((c: string) => { 
        if (c == ' ') {
            return "+"
        }
        else {
            return c.toLowerCase()
        }
    }).join('')

    const res: any = await $fetch(`${baseUrl}?q=${query}`, {
        method: 'GET'
    })

    const results = (res.items as Array<any>).map((b: any) => {
        return {
            link: b.selfLink,
            title: b.volumeInfo.title,
            authors: b.volumeInfo.authors,
            volumeid: b.id,
            cover: b.volumeInfo.imageLinks.thumbnail
        }
    })
    
    return results
})