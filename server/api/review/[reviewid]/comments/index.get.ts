import { GetReviewCommentsRes } from "~/types"

export default defineEventHandler(async (event): Promise<GetReviewCommentsRes> => {
    const reviewid = getRouterParam(event, 'reviewid')
    const config = useRuntimeConfig()
    
    try {
        const res: GetReviewCommentsRes = await $fetch(`${config.public.backendBaseURL}/review/${reviewid}/comments`, {
            method: "GET",
        })
        return res
    }
    catch (e: any) {
        throw createError(e)
	}
})
