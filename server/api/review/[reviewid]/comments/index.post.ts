import { GetReviewCommentsRes } from "~/types"

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const authHeader = getHeaders(event).authorization
    const reviewid = getRouterParam(event, 'reviewid')
    const config = useRuntimeConfig()
    
    try {
        if (authHeader) {
            const res: GetReviewCommentsRes = await $fetch(`${config.public.backendBaseURL}/review/${reviewid}/comments`, {
                method: "POST",
                headers: {
                    "Authorization": authHeader
                },
                body
            })
            return res
        }
        else {
            throw createError({ message: "No auth token provided." })
        }
    }
    catch (e: any) {
        throw createError(e)
	}
})
