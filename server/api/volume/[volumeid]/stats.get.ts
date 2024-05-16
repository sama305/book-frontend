export default defineEventHandler(async (event) => {
    const volumeid = getRouterParam(event, 'volumeid')
    const config = useRuntimeConfig()
	
    try {
        // todo!!! implement type for this
        const res: {
            avgrating: number,
            reviewcount: number,
            volumeid: string
        } = await $fetch(`${config.public.backendBaseURL}/volume/${volumeid}/stats`, {
            method: "GET",
        })
        return res
    }
    catch (e: any) {
        console.log(e)
        throw createError(e)
	}
})
