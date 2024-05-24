import { GetUserFollowersRes } from "~/types"

export default defineEventHandler(async (event) => {
    const authHeader = getHeaders(event).authorization
    const username = getRouterParam(event, 'username')
    const config = useRuntimeConfig()
	
    try {
        const res: GetUserFollowersRes = await $fetch(`${config.public.backendBaseURL}/user/${username}/followers`, {
            method: "GET",
            headers: {
                "Authorization": authHeader ?? ""
            }
        })
        return res
    }
    catch (e: any) {
        throw createError(e)
	}
})
