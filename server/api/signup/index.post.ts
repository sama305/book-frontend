import { SignupRes, UserCredentials } from "~/types"

export default defineEventHandler(async (event) => {
    const body: UserCredentials = await readBody(event)
    const config = useRuntimeConfig()

    try {
        // const res: SignupRes = await $fetch(`${config.public.backendBaseURL}/signup`, {
        //     method: "POST",
        //     body
        // })
        // return res
        return { token: '12345' }
    }
    catch (e: any) {
        throw createError({ status: e.status, message: `signup error: ${e.message}` })
    }
})