<template>
    <details style="display: inline-block; user-select: none;">
        <summary>sign-up \ log-in</summary>

        <input placeholder="username..." v-model="username" />
        <br>
        <input placeholder="email..."  v-model="email" />
        <br>
        <input placeholder="password..." v-model="password" />
        <br>

        <button @click="signup" :disabled="!canCreateAccount">
            sign up
        </button>
        or
        <button @click="login" :disabled="!canLogin">
            log in
        </button>
    </details>
    <hr>
</template>

<script setup lang="ts">
import { isEmpty } from '../util/index'
import { type SignupRes, type UserCredentials } from '~/types'

const username = ref('')
const email = ref('')
const password = ref('')
const JWTtoken = useCookie('jwt_token')

const canCreateAccount = computed(() => {
    return !(isEmpty(username.value) || isEmpty(email.value) || isEmpty(password.value));
})

const canLogin = computed(() => {
    return !((isEmpty(username.value) && isEmpty(email.value)) || isEmpty(password.value));
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
    }
    catch (e) {
        console.error(e)
    }
}

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

</script>