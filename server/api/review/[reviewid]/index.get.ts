import { GetReviewRes } from "~/types"

export default defineEventHandler(async (event) => {
    const reviewid = getRouterParam(event, 'reviewid')
    const authHeader = getHeaders(event).authorization
    const config = useRuntimeConfig()
	
    try {
        const res: GetReviewRes = await $fetch(`${config.public.backendBaseURL}/review/${reviewid}`, {
            method: "GET",
            headers: {
                "Authorization": authHeader ?? ""
            }
        })
        return res
    }
    catch (e: any) {
        throw createError(e)
	}
})
