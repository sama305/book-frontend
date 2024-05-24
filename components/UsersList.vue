<template>
    <div>
        <div class="w-full flex items-start justfiy-between mb-8" v-for="u in users">
            <div class="basis-full">
                <UserCard
                    :username="u.username"
                    :title="u.username"
                    :subtitle="`No description provided.`"
                />
            </div>
            <div>
                <FollowButton
                    class="p-2"
                    :username="u.username"
                    :init-is-following="u.isfollowing"
                    @follow="followUser(u.username)"
                    @unfollow="unfollowUser(u.username)"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const jwtToken = useCookie('jwt_token')

const { users } = defineProps<{
    users: Array<any>
}>()

async function followUser(user: string) {
    await $fetch(`/api/user/${user}/follows`, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${jwtToken.value}`
        }
    })
}

async function unfollowUser(user: string) {
    await $fetch(`/api/user/${user}/follows`, {
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${jwtToken.value}`
        }
    })
}
</script>