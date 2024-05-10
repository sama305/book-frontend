import { GetUserRes } from "~/types"

export default defineEventHandler(async (event) => {
    const username = getRouterParam(event, 'username')
    const config = useRuntimeConfig()
	
    try {
        const res: GetUserRes = await $fetch(`${config.public.backendBaseURL}/user/${username}/reviews`, {
            method: "GET",
        })
        return res
    }
    catch (e: any) {
        throw createError(e)
	}
})
