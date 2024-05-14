<template>
    <div>
        <p class="inline-block text-3xl mr-8" style="user-select: none; cursor: pointer;" @click="navigateTo('/')">Books.com</p>
    </div>
    <div class="flex content-start">
        <template v-if="JWTtoken">
            <UButton class="mr-2" icon="i-heroicons-pencil-square-16-solid" @click="newReviewModal = true">New Review</UButton>
            <UDropdown :items="ops" :popper="{ placement: 'bottom-start' }">
                <UButton :ui="{ rounded: 'rounded-full' }" square class="mr-2" color="white" icon="i-heroicons-user-circle-16-solid"/>
            </UDropdown>
        </template>
        <template v-else>
            <UButton class="mr-2" @click="routeToSignup">Signup</UButton>
            <UButton @click="loginModal = true" color="white">Login</UButton>
        </template>
    </div>

    <!-- Log In Modal -->
    <UModal v-model="loginModal" :overlay="false">
        <LoginCard @login="(user, pass) => login(user, pass)" />
    </UModal>

    <!-- Create Review Modal -->
    <UModal v-model="newReviewModal" :overlay="false">
        <NewReviewCard @post-review="onPostReview" />
    </UModal>
</template>

<script setup lang="ts">
import { type SignupRes, type UserCredentials } from '~/types'
import LoginCard from './LoginCard.vue';
import { jwtDecode } from 'jwt-decode';

const searchQuery = ref('')
const loginModal = ref(false)
const newReviewModal = ref(false)

const toast = useToast()
const JWTtoken = useCookie('jwt_token')

const emit = defineEmits(['search'])

watch(searchQuery, (newVal, _) => {
    emit('search', newVal)
})

const ops = [
    [
        {
            label: 'Profile',
            icon: 'i-heroicons-user-circle-16-solid',
            click: async () => {
                if (JWTtoken.value) {
                    const username = (jwtDecode(JWTtoken.value) as any).username
                    await navigateTo(`/user/${username}`)
                }
                else {
                    await logout()
                }
            }
        },
    ], 
    [
        {
            label: 'Settings',
            icon: 'i-heroicons-cog-8-tooth-16-solid',
        },
        {
            label: 'Logout',
            icon: 'i-heroicons-arrow-right-end-on-rectangle-16-solid',
            click: async () => {
                await logout()
            }
        }
    ]
]

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
    finally {
        reloadNuxtApp()
    }
}

function onPostReview(reviewId: string) {
    newReviewModal.value = false
    toast.add({
        title: `New review ${reviewId} added.`,
    })
}

async function logout() {
    JWTtoken.value = undefined
    reloadNuxtApp()
}

function routeToSignup() {
    navigateTo('/signup')
}
</script>