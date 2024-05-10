import { GetUserReviewsRes } from "~/types"

export default defineEventHandler(async (event) => {
    const username = getRouterParam(event, 'username')
    const config = useRuntimeConfig()
	
    try {
        const res: GetUserReviewsRes = await $fetch(`${config.public.backendBaseURL}/user/${username}/reviews`, {
            method: "GET",
            params: {
                sort_order: "post_date",
                sort_dir: "ascending",
                page: 0,
                amount: 10,
            }
        })
        return res
    }
    catch (e: any) {
        throw createError(e)
	}
})
