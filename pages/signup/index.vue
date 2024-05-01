<template>
    <UInput placeholder="username..." v-model="username" />
    <UInput placeholder="email..."  v-model="email" />
    <UInput placeholder="password..." v-model="password" />

    <UButton @click="signup" :disabled="!canCreateAccount">
        Signup
    </UButton>
</template>

<script setup lang="ts">
import { isEmpty } from '../../util/index'
import { type SignupRes, type UserCredentials } from '~/types'

const username = ref('')
const email = ref('')
const password = ref('')
const JWTtoken = useCookie('jwt_token')

const canCreateAccount = computed(() => {
    return !(isEmpty(username.value) || isEmpty(email.value) || isEmpty(password.value));
})

async function signup() {
    try {
        const res: SignupRes = await $fetch('/api/signup', {
            method: 'POST',
            body: <UserCredentials>{
                username: username.value,
                password: password.value,
                email: email.value,
            }
        })

        // setting cookie
        if (res.token) {
            JWTtoken.value = res.token
        }
        navigateTo('/')
    }
    catch (e) {
        console.error(e)
    }
}
</script>