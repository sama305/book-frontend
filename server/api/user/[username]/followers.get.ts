import { GetUserFollowersRes } from "~/types"

export default defineEventHandler(async (event) => {
    const username = getRouterParam(event, 'username')
    const config = useRuntimeConfig()
	
    try {
        const res: GetUserFollowersRes = await $fetch(`${config.public.backendBaseURL}/user/${username}/followers`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${event.context.auth.token}`
            }
        })
        return res
    }
    catch (e: any) {
        throw createError(e)
	}
})
