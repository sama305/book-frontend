export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const username = getRouterParam(event, 'username')
	
    try {
        const res = await $fetch(`${config.public.backendBaseURL}/user/${username}/follows`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${event.context.auth.token}`
            },
        })
        return res
    }
    catch (e: any) {
        throw createError(e)
	}
})
