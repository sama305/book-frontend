import { PatchDescReq } from "~/types"

export default defineEventHandler(async (event) => {
    const username = getRouterParam(event, 'username')
    const body: PatchDescReq = await readBody(event)
    const authHeader = getHeaders(event).authorization
    const config = useRuntimeConfig()
	
    try {
        if (authHeader) {
            const res = await $fetch(`${config.public.backendBaseURL}/user/${username}/description`, {
                method: "PATCH",
                headers: {
                    "Authorization": authHeader
                },
                body,
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
