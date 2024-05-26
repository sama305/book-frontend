export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const commentid = getRouterParam(event, 'commentid')
	
    try {
        const res = await $fetch(`${config.public.backendBaseURL}/comment/${commentid}/likes`, {
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
