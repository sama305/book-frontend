import { GetUserReviewsCount } from "~/types"

export default defineEventHandler(async (event) => {
    const username = getRouterParam(event, 'username')
    const config = useRuntimeConfig()
	
    try {
        console.log()
        const res: GetUserReviewsCount = await $fetch(`${config.public.backendBaseURL}/user/${username}/reviews/count`, {
            method: "GET",
        })
        return res.count
    }
    catch (e: any) {
        throw createError(e)
	}
})
