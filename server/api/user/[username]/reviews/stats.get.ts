import { GetUserReviewsStatsRes } from "~/types"

export default defineEventHandler(async (event) => {
    const username = getRouterParam(event, 'username')
    const config = useRuntimeConfig()
	
    try {
        const res: GetUserReviewsStatsRes = await $fetch(`${config.public.backendBaseURL}/user/${username}/reviews/stats`, {
            method: "GET",
        })
        return res
    }
    catch (e: any) {
        throw createError(e)
	}
})
