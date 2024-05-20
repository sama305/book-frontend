export default defineEventHandler(async (event) => {
    const authHeader = getHeaders(event).authorization
    const config = useRuntimeConfig()
    const commentid = getRouterParam(event, 'commentid')
	
    try {
        if (authHeader) {
            const res = await $fetch(`${config.public.backendBaseURL}/comment/${commentid}/likes`, {
                method: "POST",
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
