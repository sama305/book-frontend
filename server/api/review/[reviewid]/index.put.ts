import { PutReviewReq, PutReviewRes } from "~/types"

export default defineEventHandler(async (event) => {
    const reviewid = getRouterParam(event, 'reviewid')
    const body: PutReviewReq = await readBody(event)
    const config = useRuntimeConfig()
	
    try {
        const res: PutReviewRes = await $fetch(`${config.public.backendBaseURL}/review/${reviewid}`, {
            method: "PUT",
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
