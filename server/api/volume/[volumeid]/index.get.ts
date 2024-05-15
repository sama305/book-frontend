import { GetVolumeRes } from "~/types"

const baseUrl = 'https://www.googleapis.com/books/v1/volumes'

export default defineEventHandler(async (event) => {
    const volumeid = getRouterParam(event, 'volumeid')
	
    try {
        const res: any = await $fetch(`${baseUrl}/${volumeid}`, {
            method: "GET",
        })
        return <GetVolumeRes>{
            authors: res.volumeInfo.authors,
            title: res.volumeInfo.title,
            cover: res.volumeInfo.imageLinks?.thumbnail ?? "",
            pageCount: res.volumeInfo.pageCount,
            publishedYear: res.volumeInfo.publishedDate,
            description: res.volumeInfo.description
        }
    }
    catch (e: any) {
        throw createError(e)
	}
})
