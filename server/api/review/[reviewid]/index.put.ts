import { PutReviewReq, PutReviewRes } from "~/types"

export default defineEventHandler(async (event) => {
    const body: PutReviewReq = await readBody(event)
    const reviewid = getRouterParam(event, 'reviewid')
    const authHeader = getHeaders(event).authorization
    const config = useRuntimeConfig()
	
    try {
        if (authHeader) {
            const res: PutReviewRes = await $fetch(`${config.public.backendBaseURL}/review/${reviewid}`, {
                method: "PUT",
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
