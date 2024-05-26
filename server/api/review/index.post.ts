import { PostReviewReq, PostReviewRes } from "~/types"

export default defineEventHandler(async (event) => {
    const body: PostReviewReq = await readBody(event)
    const config = useRuntimeConfig()
	
    try {
        const res: PostReviewRes = await $fetch(`${config.public.backendBaseURL}/review`, {
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
