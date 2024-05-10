<template>
    <NuxtPage/>
    <UNotifications/>
</template>

<script setup lang="ts">
import { jwtDecode } from 'jwt-decode'

const jwtToken = useCookie('jwt_token')

if (jwtToken && jwtToken.value) {
    try {
        const payload: any = jwtDecode(jwtToken.value)
        
        const res = await $fetch(`/api/user/${payload.username}`, {
            method: 'GET'
        })

        // user does not exist on backend
        if (payload.username !== res.username) {
            jwtToken.value = undefined
        }
    }
    catch(InvalidTokenError) {
        console.error('Invalid token')
        jwtToken.value = undefined
    }
}
</script>