export default defineEventHandler(async (event) => {
    const authHeader = getHeaders(event).authorization
    const config = useRuntimeConfig()
    const username = getRouterParam(event, 'username')
	
    try {
        if (authHeader) {
            const res = await $fetch(`${config.public.backendBaseURL}/user/${username}/follows`, {
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
