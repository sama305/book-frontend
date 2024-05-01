<template>
    <UCard>
        <template #header>
            <UButton @click="routeToSignup" color="white" label="Sign-up"/>
            <template v-if="JWTtoken">
                <UButton @click="logout">Logout</UButton>
            </template>
            <template v-else>
                <UButton @click="loginModal = true">Login</UButton>
            </template>
        </template>
    </UCard>
    <UModal v-model="loginModal" class="w-64">
        <UCard>
            <UInput aria-placeholder="username..." v-model="username"/>
            <UInput aria-placeholder="password..." v-model="password"/>
            <UButton @click="login" :disabled="!canLogin">Login</UButton>
        </UCard>
    </UModal>
</template>

<script setup lang="ts">
import { isEmpty } from '../util/index'
import { type SignupRes, type UserCredentials } from '~/types'

const username = ref('')
const email = ref('')
const password = ref('')
const loginModal = ref(false)
const JWTtoken = useCookie('jwt_token')

const canLogin = computed(() => {
    return !((isEmpty(username.value) && isEmpty(email.value)) || isEmpty(password.value));
})

async function login() {
    try {
        const res: SignupRes = await $fetch('/api/login', {
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
    }
    catch (e) {
        console.error(e)
    }
}

async function logout() {
    JWTtoken.value = undefined
}

function routeToSignup() {
    navigateTo('/signup')
}

</script>