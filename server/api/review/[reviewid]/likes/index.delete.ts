export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const reviewid = getRouterParam(event, 'reviewid')
	
    try {
        const res = await $fetch(`${config.public.backendBaseURL}/review/${reviewid}/likes`, {
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
