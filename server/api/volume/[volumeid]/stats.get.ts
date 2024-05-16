import { GetUserReviewsRes } from "~/types"

const baseUrl = 'https://www.googleapis.com/books/v1/volumes'

export default defineEventHandler(async (event) => {
    const volumeid = getRouterParam(event, 'volumeid')
	
    try {
        // todo!!! implement type for this
        const res: any = await $fetch(`${baseUrl}/${volumeid}/stats`, {
            method: "GET",
        })
        return res
    }
    catch (e: any) {
        throw createError(e)
	}
})
