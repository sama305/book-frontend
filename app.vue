<template>
    <NuxtPage/>
    <UNotifications/>
</template>

<script setup lang="ts">
// import type { LoginRes } from './types';

// const jwtToken = useCookie('jwt_token')

// if (jwtToken && jwtToken.value) {
//     try {
//         const res: LoginRes = await $fetch('/api/login', {
//             method: 'POST',
//             body: {
//                 token: jwtToken.value
//             }
//         })
        
//         if (res.token != jwtToken.value)
//             jwtToken.value = res.token
//     }
//     catch(e: any) {
//         console.error(e)
//         jwtToken.value = undefined
//     }
// }
</script>