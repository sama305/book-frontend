<template>
    <div class="w-64">
        <p class="text-s font-thin">Username</p>
        <UInput class="mb-4" v-model="username" />
        <p class="text-s font-thin">Email</p>
        <UInput class="mb-4" v-model="email" />
        <p class="text-s font-thin">Password</p>
        <UInput class="mb-4" v-model="password" />
    </div>

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