<template>
    <UCard>
        <p class="text-s font-thin">Username</p>
        <UInput class="mb-4" padded v-model="username"/>
        <p class="text-s font-thin">Password</p>
        <UInput class="mb-4" padded type="password" v-model="password"/>
        <UButton @click="$emit('login', username, password)" :disabled="!canLogin">Login</UButton>
    </UCard>
</template>

<script setup lang="ts">
import { isEmpty } from '~/util';

const username = ref('')
const password = ref('')

const canLogin = computed(() => {
    return !(isEmpty(username.value) || isEmpty(password.value));
})
</script>