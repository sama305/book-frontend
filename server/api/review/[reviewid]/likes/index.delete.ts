export default defineEventHandler(async (event) => {
    const authHeader = getHeaders(event).authorization
    const config = useRuntimeConfig()
    const reviewid = getRouterParam(event, 'reviewid')
	
    try {
        if (authHeader) {
            const res = await $fetch(`${config.public.backendBaseURL}/review/${reviewid}/likes`, {
                method: "DELETE",
                headers: {
                    "Authorization": authHeader
                },
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
