import { DeleteReviewReq } from "~/types"

export default defineEventHandler(async (event) => {
    const reviewid = getRouterParam(event, 'reviewid')
    const body: DeleteReviewReq = await readBody(event)
    const authHeader = getHeaders(event).authorization
    const config = useRuntimeConfig()
	
    try {
        if (authHeader) {
            await $fetch(`${config.public.backendBaseURL}/review/${reviewid}`, {
                method: "DELETE",
                headers: {
                    "Authorization": authHeader
                },
                body,
            })
        }
        else {
            throw createError({ message: "No auth token provided." })
        }
    }
    catch (e: any) {
        throw createError(e)
	}
})
