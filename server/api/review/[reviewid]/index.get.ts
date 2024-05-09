import { GetReviewRes } from "~/types"

export default defineEventHandler(async (event) => {
    const reviewid = getRouterParam(event, 'reviewid')
    const config = useRuntimeConfig()
	
    try {
        const res: GetReviewRes = await $fetch(`${config.public.backendBaseURL}/review/${reviewid}`, {
            method: "GET",
        })
        return res
    }
    catch (e: any) {
        throw createError(e)
	}
})
