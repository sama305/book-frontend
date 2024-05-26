export default defineEventHandler((event) => {
    const cookies = parseCookies(event)
    const token = cookies?.jwt_token
    event.context.auth = { token }
})  