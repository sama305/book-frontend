import { UserCredentials } from "~/types"

export default defineEventHandler(async (event) => {
    const body: UserCredentials = await readBody(event)
})