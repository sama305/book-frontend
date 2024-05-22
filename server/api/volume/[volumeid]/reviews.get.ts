import { GetVolumeReviewsRes } from "~/types"

export default defineEventHandler(async (event) => {
    const authHeader = getHeaders(event).authorization
    const volumeid = getRouterParam(event, 'volumeid')
    const config = useRuntimeConfig()
    const queries: { page: number, reviewsPerPage: number } = await getQuery(event)
	
    try {
        if (authHeader) {
            const res: GetVolumeReviewsRes = await $fetch(`${config.public.backendBaseURL}/volume/${volumeid}/reviews`, {
                method: "GET",
                query: {
                    sort_order: "post_date",
                    sort_dir: "ascending",
                    page: queries.page,
                    amount: queries.reviewsPerPage,
                },
                headers: {
                    "Authorization": authHeader
                }
            })
            return res
        }
    }
    catch (e: any) {
        throw createError(e)
	}
})
