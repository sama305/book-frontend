import { GetReviewCommentsRes } from "~/types"

export default defineEventHandler(async (event): Promise<GetReviewCommentsRes> => {
    const reviewid = getRouterParam(event, 'reviewid')
    const authHeader = getHeaders(event).authorization
    const config = useRuntimeConfig()
    const queries: { page: number, commentsPerPage: number } = await getQuery(event)
    
    try {
        if (authHeader) {
            const res: GetReviewCommentsRes = await $fetch(`${config.public.backendBaseURL}/review/${reviewid}/comments`, {
                method: "GET",
                query: {
                    sort_order: "post_date",
                    sort_dir: "ascending",
                    page: queries.page,
                    amount: queries.commentsPerPage,
                },
                headers: {
                    "Authorization": authHeader
                }
            })
            return res
        }
        else {
            throw createError({ message: "No auth token provided." })
        }
    }
    catch (e: any) {
        throw createError(e)
	}
})
