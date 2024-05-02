<template>
    <PageHeader>
        <SignupHeader />
    </PageHeader>
    <hr>
    <PageBody>
        <div class="w-64">
            <p class="text-s font-thin">Username</p>
            <UInput v-model="username" />
            <template v-if="username.length > 0 && !isValidUsername(username)">
                <div class="h-4">
                    <p class="m-0 mb-2 font-light text-red-500 text-xs">Must be at least 4 alphanumeric characters.</p>
                </div>
            </template>
            <template v-else>
                <div class="h-4"></div>
            </template>
            
            
            <p class="font-thin">Email</p>
            <UInput v-model="email" />
            <template v-if="email.length > 0 && !isValidEmail(email)">
                <div class="h-4">
                    <p class="m-0 mb-2 font-light text-red-500 text-xs">Must be a valid email.</p>
                </div>
            </template>
            <template v-else>
                <div class="h-4"></div>
            </template>


            <p class="font-thin">Password</p>
            <UInput type="password" v-model="password" />
            <template v-if="password.length > 0 && !isValidPassword(password)">
                <div class="h-8">
                    <p class="m-0 mb-2 font-light text-red-500 text-xs">Must be at least 8 characters and a digit.</p>
                </div>
            </template>
            <template v-else>
                <div class="h-8"></div>
            </template>
        </div>

        <UButton @click="signup" :disabled="!canCreateAccount(username, email, password)">
            Signup
        </UButton>
    </PageBody>
</template>

<script setup lang="ts">
import { type SignupRes, type UserCredentials } from '~/types'

const username = ref('')
const email = ref('')
const password = ref('')
const JWTtoken = useCookie('jwt_token')

function canCreateAccount(user: string, email: string, pass: string) {
    return isValidUsername(user) && isValidEmail(email) && isValidPassword(pass)
}

// usernames must be 8 characters and alphanumeric 
function isValidUsername(user: string) {
    return /^(?=.*?[a-z0-9]).{4,}$/i.test(user)
}

// no idea how this works
function isValidEmail(email: string) {
    return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email)
}

function isValidPassword(password: string) {
    return /^(?=.*?[A-Za-z])(?=.*?[0-9]).{8,}$/.test(password)
}

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