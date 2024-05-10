import { PostReviewReq, PostReviewRes } from "~/types"

export default defineEventHandler(async (event) => {
    const body: PostReviewReq = await readBody(event)
    const authHeader = getHeaders(event).authorization
    const config = useRuntimeConfig()
	
    try {
        if (authHeader) {
            const res: PostReviewRes = await $fetch(`${config.public.backendBaseURL}/review`, {
                method: "POST",
                headers: {
                    "Authorization": authHeader
                },
                body
            })
            return res
        }
    }
    catch (e: any) {
        throw createError(e)
	}
})
