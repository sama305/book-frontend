import { GetUserReviewsRes } from "~/types"

export default defineEventHandler(async (event) => {
    const username = getRouterParam(event, 'username')
    const config = useRuntimeConfig()
    const queries: { page: number, booksPerPage: number } = await getQuery(event)
	
    try {
        const res: GetUserReviewsRes = await $fetch(`${config.public.backendBaseURL}/user/${username}/reviews`, {
            method: "GET",
            query: {
                sort_order: "post_date",
                sort_dir: "ascending",
                page: queries.page,
                amount: queries.booksPerPage,
            }
        })
        return res
    }
    catch (e: any) {
        throw createError(e)
	}
})
