import { LoginReq, LoginRes } from "~/types"

export default defineEventHandler(async (event) => {
    const body: LoginReq = await readBody(event)
    const config = useRuntimeConfig()

    try {
        const res: LoginRes = await $fetch(`${config.public.backendBaseURL}/login`, {
            method: "POST",
            body
        })
        return res
    }
    catch (e: any) {
        throw createError(e)
    }
})