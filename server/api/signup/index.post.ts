import { SignupRes, UserCredentials } from "~/types"

export default defineEventHandler(async (event) => {
    const body: UserCredentials = await readBody(event)
    const config = useRuntimeConfig()

    try {
        const res = await $fetch(`${config.public.backendBaseURL}/signup`, {
            method: "POST",
            body
        })
        console.log(res)
        return res
    }
    catch (e: any) {
        throw createError(e)
    }
})