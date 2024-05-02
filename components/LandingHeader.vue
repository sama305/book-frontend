<template>
    <div>
        <p class="inline-block text-3xl mr-8" style="user-select: none; cursor: pointer;" @click="navigateTo('/')">Books.com</p>
        <UInput 
            variant="none" 
            size="xl"
            placeholder="Search..." 
            icon="i-heroicons-magnifying-glass-20-solid"
            autocomplete="off"
            class="inline-block "
            v-model="searchQuery"
        />
    </div>
    <div>
        <template v-if="JWTtoken">
            <UButton class="mr-2">New Review</UButton>
            <UButton @click="logout" color="white">Logout</UButton>
        </template>
        <template v-else>
            <UButton class="mr-2" @click="routeToSignup">Signup</UButton>
            <UButton @click="loginModal = true" color="white">Login</UButton>
        </template>
    </div>

    <!-- Log In Modal -->
    <UModal v-model="loginModal" :overlay="false">
        
    </UModal>

    <!-- Create Review Modal -->
    <UModal v-model="loginModal" :overlay="false">
        <LoginCard @login="(user, pass) => login(user, pass)" />
    </UModal>
</template>

<script setup lang="ts">
import { type SignupRes, type UserCredentials } from '~/types'
import LoginCard from './LoginCard.vue';

const searchQuery = ref('')
const loginModal = ref(false)

const toast = useToast()
const JWTtoken = useCookie('jwt_token')

const emit = defineEmits(['search'])

watch(searchQuery, (oldVal, _) => {
    emit('search', oldVal)
})

async function login(username: string, password: string) {
    try {
        const res: SignupRes = await $fetch('/api/login', {
            method: 'POST',
            body: <UserCredentials>{
                username: username,
                password: password,
                email: '',
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