import { SignupReq, SignupRes } from "~/types"

export default defineEventHandler(async (event) => {
    const body: SignupReq = await readBody(event)
    const config = useRuntimeConfig()
	
    try {
        const res: SignupRes = await $fetch(`${config.public.backendBaseURL}/signup`, {
            method: "POST",
            body
        })
        return res
    }
    catch (e: any) {
        throw createError(e)
	}
})
