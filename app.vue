<template>
    <div class="p-4 flex justify-between">
        <div>
            <p class="inline-block text-3xl mr-8">Books.com</p>
            <UInput 
                variant="none" 
                size="xl"
                placeholder="Search..." 
                icon="i-heroicons-magnifying-glass-20-solid"
                autocomplete="off"
                class="inline-block "
            />
        </div>
        <div>
            <template v-if="JWTtoken">
                <UButton @click="logout">Logout</UButton>
            </template>
            <template v-else>
                <UButton class="mr-2" @click="routeToSignup" color="white" label="Sign-up"/>
                <UButton @click="loginModal = true">Login</UButton>
            </template>
        </div>
    </div>
    <hr>
    <div class="p-4">
        <NuxtPage />
    </div>

    <UModal v-model="loginModal" :overlay="false">
        <UCard>
            <p class="text-s font-thin">Username</p>
            <UInput class="mb-4" padded v-model="username"/>
            <p class="text-s font-thin">Password</p>
            <UInput class="mb-4" padded type="password" v-model="password"/>
            <UButton @click="login" :disabled="!canLogin">Login</UButton>
        </UCard>
    </UModal>
    <UNotifications />
</template>

<script setup lang="ts">
import { isEmpty } from './util/index'
import { type SignupRes, type UserCredentials } from '~/types'

const username = ref('')
const email = ref('')
const password = ref('')
const loginModal = ref(false)

const toast = useToast()
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
        
        loginModal.value = false;
    }
    catch (e: any) {
        if (e.data.data === "Could not log user in\n") {
            toast.add({
                title: 'User not found.',
            })
        }
        else {
            console.error(e)
        }
    }
}

async function logout() {
    JWTtoken.value = undefined
}

function routeToSignup() {
    navigateTo('/signup')
}
</script>