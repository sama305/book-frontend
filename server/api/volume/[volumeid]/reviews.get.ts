import { GetVolumeReviewsRes } from "~/types"

export default defineEventHandler(async (event) => {
    const volumeid = getRouterParam(event, 'volumeid')
    const config = useRuntimeConfig()
	
    try {
        const res: GetVolumeReviewsRes = await $fetch(`${config.public.backendBaseURL}/volume/${volumeid}/reviews`, {
            method: "GET",
            query: {
                sort_order: "post_date",
                sort_dir: "ascending",
                page: 0,
                amount: 4,
            }
        })
        return res
    }
    catch (e: any) {
        console.log(e)
        throw createError(e)
	}
})
