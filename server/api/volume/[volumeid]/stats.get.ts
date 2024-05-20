import { GetVolumeStatsRes } from "~/types"

export default defineEventHandler(async (event) => {
    const volumeid = getRouterParam(event, 'volumeid')
    const config = useRuntimeConfig()
	
    try {
        const res: GetVolumeStatsRes = await $fetch(`${config.public.backendBaseURL}/volume/${volumeid}/stats`, {
            method: "GET",
        })
        return res
    }
    catch (e: any) {
        console.log(e)
        throw createError(e)
	}
})
