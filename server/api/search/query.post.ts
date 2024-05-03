import { BookSearchInfo } from "~/types";

const baseUrl = 'https://openlibrary.org/search.json'

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const query = body.query.split('').map((c: string) => { 
        if (c == ' ') {
            return "%20"
        }
        else {
            return c.toLowerCase()
        }
    }).join('')

    const res: any = await $fetch(`${baseUrl}?q=${query}&fields=key,author_key,author_name,first_publish_year,title,cover_edition_key,cover_i&limit=6`, {
        method: 'GET'
    })

    const results = (res.docs as Array<BookSearchInfo>).filter(b => b.cover_i !== undefined)
    
    return {
        results,
        numFound: res.numFound,
    }
})