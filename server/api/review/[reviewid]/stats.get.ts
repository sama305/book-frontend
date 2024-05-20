import { GetReviewStatsRes } from "~/types"

export default defineEventHandler(async (event) => {
    const reviewid = getRouterParam(event, 'reviewid')
    const config = useRuntimeConfig()
	
    try {
        const res: GetReviewStatsRes = await $fetch(`${config.public.backendBaseURL}/review/${reviewid}/stats`, {
            method: "GET",
        })
        return res
    }
    catch (e: any) {
        throw createError(e)
	}
})
