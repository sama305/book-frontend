import { GetReviewCommentsRes } from "~/types"

export default defineEventHandler(async (event): Promise<GetReviewCommentsRes> => {
    const reviewid = getRouterParam(event, 'reviewid')
    const config = useRuntimeConfig()
    const queries: { page: number, commentsPerPage: number } = await getQuery(event)
    
    try {
        const res: GetReviewCommentsRes = await $fetch(`${config.public.backendBaseURL}/review/${reviewid}/comments`, {
            method: "GET",
            query: {
                sort_order: "post_date",
                sort_dir: "ascending",
                page: queries.page,
                amount: queries.commentsPerPage,
            },
            headers: {
                "Authorization": `Bearer ${event.context.auth.token}`
            }
        })
        return res
    }
    catch (e: any) {
        throw createError(e)
	}
})
