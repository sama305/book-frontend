import { DeleteReviewReq } from "~/types"

export default defineEventHandler(async (event) => {
    const reviewid = getRouterParam(event, 'reviewid')
    const body: DeleteReviewReq = await readBody(event)
    const config = useRuntimeConfig()
	
    try {
        await $fetch(`${config.public.backendBaseURL}/review/${reviewid}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${event.context.auth.token}`
            },
            body,
        })
    }
    catch (e: any) {
        throw createError(e)
	}
})
