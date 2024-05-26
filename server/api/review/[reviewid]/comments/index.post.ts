import { GetReviewCommentsRes } from "~/types"

export default defineEventHandler(async (event) => {
    const reviewid = getRouterParam(event, 'reviewid')
    const body = await readBody(event)
    const config = useRuntimeConfig()
    
    try {
        const res: GetReviewCommentsRes = await $fetch(`${config.public.backendBaseURL}/review/${reviewid}/comments`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${event.context.auth.token}`
            },
            body
        })
        return res
    }
    catch (e: any) {
        throw createError(e)
	}
})
