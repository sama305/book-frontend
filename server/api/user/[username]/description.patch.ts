import { PatchDescReq } from "~/types"

export default defineEventHandler(async (event) => {
    const username = getRouterParam(event, 'username')
    const body: PatchDescReq = await readBody(event)
    const config = useRuntimeConfig()
	
    try {
        const res = await $fetch(`${config.public.backendBaseURL}/user/${username}/description`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${event.context.auth.token}`
            },
            body,
        })
        return res
    }
    catch (e: any) {
        throw createError(e)
	}
})
