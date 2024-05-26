<template>
    <UButton :disabled="followercount === 0" icon="i-heroicons-users-16-solid" @click="openFollowersModal" variant="link" class="p-0">
        {{ followercount }} followers
    </UButton>
    <br>
    <UButton :disabled="followingcount === 0" icon="i-heroicons-user-16-solid" @click="openFollowingModal" variant="link" class="p-0">
        {{ followingcount }} following
    </UButton>

    <UModal v-model="followersModal">
        <UCard>
            <p class="text-3xl text-center mb-8">Users that follow {{ username }}</p>
            <UsersList
                :users="followers"
                :total-users="followercount"
            />
        </UCard>
    </UModal>

    <UModal v-model="followingModal">
        <UCard>
            <p class="text-3xl text-center mb-8">Users that {{ username }} follows</p>
            <UsersList
                :users="following"
                :total-users="followingcount"
            />
        </UCard>
    </UModal>
</template>

<script setup lang="ts">
const { username, followercount, followingcount } = defineProps<{
    username: string,
    followercount: number,
    followingcount: number
}>()

const followers = await $fetch(`/api/user/${username}/followers`, {
    method: 'GET'
})
const following = await $fetch(`/api/user/${username}/following`, {
    method: 'GET'
})

const followersModal = ref(false)
const followingModal = ref(false)

async function openFollowersModal() {
    followersModal.value = true
}

function openFollowingModal() {
    followingModal.value = true
}
</script>