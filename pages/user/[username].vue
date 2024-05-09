<template>
    <PageHeader>
        <div>
            <p class="inline-block text-3xl mr-8">
                <template v-if="userInfo">
                    {{ userInfo.username }}'s profile
                </template>
                <template v-else>
                    User {{ username }} was not found
                </template>
            </p>
        </div>
    </PageHeader>

    <hr>

    <PageBody v-if="userInfo">
        <div class="mb-4">
            <UCard class="w-64">
                <template #header>
                    <p class="text-2xl">About me</p>
                </template>
                
                <div v-if="!isEmpty(userDescription) && !editingDesc" style="white-space: pre-wrap;">
                    {{ userDescription }}
                </div>
                <div v-if="editingDesc">
                    <UTextarea v-model="userDescription" class="mb-2" placeholder="Tell us a little about yourself..." />
                    <UButton icon="i-heroicons-check-16-solid" @click="editingDesc = false">Save</UButton>
                </div>
            </UCard>
        </div>
        
        <div class="w-64 mb-8">
            <UButton size="sm" icon="i-heroicons-pencil-square-16-solid" class="w-fit" v-if="!editingDesc" @click="editingDesc = true">Edit description</UButton>
        </div>
        <p>Joined {{ new Date(userInfo.join_date).toISOString().substring(0, 10) }}</p>
        <p>{{ userInfo.email }}</p>
    </PageBody>
</template>

<script setup lang="ts">
import type { GetUserRes } from '~/types';
import { isEmpty } from '~/util';
import { jwtDecode } from "jwt-decode"

const username = useRoute().params.username;
const validated = ref(false)
const jwtToken = useCookie('jwt_token')

const editingDesc = ref(false)
const userDescription = ref('')

const userInfo: GetUserRes = await $fetch(`/api/user/${username}`, {
    method: 'GET'
})

if (userInfo) {
    userDescription.value = userInfo.description
    // validate incoming user
    if (jwtToken && jwtToken.value) {
        const decoded: any = jwtDecode(jwtToken.value)
        if (decoded.username === userInfo.username) {
            validated.value = true
        }
    }
}
</script>