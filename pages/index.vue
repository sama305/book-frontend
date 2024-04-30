<template>
    <input placeholder="username..." v-model="username" />
    <br>
    <input placeholder="email..."  v-model="email" />
    <br>
    <input placeholder="password..." v-model="password" />
    <br>

    <button @click="signup" :disabled="canCreateAccount">
        create account
    </button>
</template>

<script setup lang="ts">
import { isEmpty } from '../util/index'
import { type UserCredentials } from '~/types'

const username = ref('')
const email = ref('')
const password = ref('')

const canCreateAccount = computed(() => {
    return isEmpty(username.value) || isEmpty(email.value) || isEmpty(password.value);
})

async function signup() {
    const res = await $fetch('/api/signup', {
        method: 'POST',
        body: <UserCredentials>{
            username: username.value,
            password: password.value,
            email: email.value,
        }
    })
}

</script>