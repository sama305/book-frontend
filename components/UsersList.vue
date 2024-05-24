<template>
    <div>
        <div class="w-full flex items-start justfiy-between mb-8" v-for="u in currentPageOfUsers" :key="u.username">
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
        <UPagination v-model="currentPage" :page-count="usersPerPage" :total="totalUsers" />
    </div>
</template>

<script setup lang="ts">
const jwtToken = useCookie('jwt_token')

const { users, totalUsers } = defineProps<{
    users: Array<{
        username: string,
        isfollowing: boolean
    }>,
    totalUsers: number
}>()

const currentPage = ref(1)
const usersPerPage = 4;

const currentPageOfUsers = computed(() => users.slice((currentPage.value - 1) * usersPerPage, (currentPage.value-1) * usersPerPage + usersPerPage))

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