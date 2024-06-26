<template>
    <PageHeader>
        <LandingHeader @post-review="refetchReviews" />
    </PageHeader>

    <hr>

    <PageBody v-if="userInfo">
        <div class="w-4/5 m-auto">
            <div class="grid lg:h-[70vh] lg:gap-[30px] md:gap-[15px] lg:grid-cols-[20%_75%] md:grid-cols lg:grid-rows-3">
                <div class="lg:row-start-1 lg:row-end-2 lg:col-start-1 lg:col-end-2 md:row-start-1 md:row-end-2 md:col-start-1 md:col-end-2">
                    <UserCard
                        :username="userInfo.username"
                        :subtitle="`Joined ${strToDate(userInfo.join_date)}`"
                        class="mb-4"
                    >
                        <template #title>
                            <div class="flex flex-wrap items-baseline justify-between">
                                <p class="text-2xl">{{ userInfo.username }}</p>
                                <template v-if="isNotSelf()">
                                    <FollowButton
                                        :init-is-following="userInfo.isfollowing"
                                        @follow="followUser"
                                        @unfollow="unfollowUser"
                                    />
                                </template>
                            </div>
                        </template>
                    </UserCard>
                    <UCard>
                        <UserFollowsButtons
                            :username="userInfo.username"
                            :followercount="userInfo.followercount"
                            :followingcount="userInfo.followingcount"
                        />
                    </UCard>
                </div>
                <div class="lg:row-start-2 lg:row-end-3 lg:col-start-1 lg:col-end-2 md:row-start-1 md:row-end-2 md:col-start-1 md:col-end-2">
                    <UCard class="h-full">
                        <template v-if="!editingDesc">
                            <div class="flex items-start justify-between" style="white-space: pre-wrap;">
                                <template v-if="!isEmpty(userDescription)">
                                    {{ userDescription }}
                                </template>
                                <template v-else>
                                    <p class="text-gray-400">{{ userInfo.username }} hasn't written a profile description yet.</p>
                                </template>
                                <UButton size="sm" icon="i-heroicons-pencil-square-16-solid" square class="w-fit p-1" v-if="isUserValid(jwtToken, userInfo.username) && !editingDesc" @click="editingDesc = true" variant="link" />
                            </div>
                        </template>

                        <div v-else>
                            <UTextarea v-model="userDescription" class="mb-2" placeholder="Tell us a little about yourself..." />
                            <UButton icon="i-heroicons-check-16-solid" @click="onSaveDesc">Save</UButton>
                        </div>
                    </UCard>
                </div>
                <div class="lg:row-start-3 lg:row-end-4 lg:col-start-1 lg:col-end-2 md:row-start-1 md:row-end-2 md:col-start-2 md:col-end-3">
                    <UCard class="md:h-full lg:h-fit">
                        <UButton variant="ghost">
                            <div class="flex items-center">
                                <UIcon class="mr-2" name="i-heroicons-envelope" />
                                <p>{{ userInfo.email }}</p>
                            </div>
                        </UButton>
                    </UCard>
                </div>
                <div class="h-fit min-h-96 lg:row-start-1 lg:row-end-3 lg:col-start-2 lg:col-end-3 md:row-start-2 md:row-end-3 md:col-start-1 md:col-end-3">
                    <UCard class="h-full">
                        <div v-if="userReviews" class="h-full flex flex-col justify-between">
                            <div class="flex flex-wrap mb-4">
                                <template v-for="rev in userReviews">
                                    <div class="pr-4 pl-4 w-1/2" v-if="rev">
                                        <BookReviewView
                                            :review="rev"
                                            @on-open-review="navigateTo(`/review/${rev.reviewid}`)"
                                            @delete-review="refetchReviews"
                                            @update-review="refetchReviews"
                                        />
                                    </div>
                                </template>
                            </div>
                            <div>
                                <UPagination :max="5" :page-count="1" :total="numPages" v-model="currentPage"/>
                            </div>
                        </div>
                        <div v-else>
                            <p class="text-gray-400">{{ userInfo.username }} hasn't written a review yet.</p>
                        </div>
                    </UCard>
                </div>
            </div>
        </div>
    </PageBody>
</template>

<script setup lang="ts">
import type { PatchDescReq } from '~/types';
import { isEmpty, isUserValid, strToDate } from '~/util';
import { jwtDecode } from "jwt-decode"

const booksPerPage = 4;

const username = useRoute().params.username;
const jwtToken = useCookie('jwt_token')

const currentPage = ref(1)
const editingDesc = ref(false)
const userDescription = ref('')
const userReviews: Ref<Array<any>> = ref([]);

const userInfo = await $fetch(`/api/user/${username}`, {
    method: 'GET'
})

const reviewInfo = await $fetch(`/api/user/${userInfo.username}/reviews/stats`, {
    method: 'GET'
})
const numPages = Math.ceil(reviewInfo.reviewcount / booksPerPage)


if (userInfo) {
    userDescription.value = userInfo.description;

    await getPageOfReviews(0)
}

watch(currentPage, async (newVal) => {
    await getPageOfReviews(newVal - 1)
})

async function onSaveDesc() {
    editingDesc.value = false
    await $fetch(`/api/user/${userInfo.username}/description`,
    {
        method: 'PATCH',
        body: <PatchDescReq>{
            description: userDescription.value
        }
    })
}

async function getPageOfReviews(page: number) {
    // get user reviews
    userReviews.value = []
    const res = await $fetch(`/api/user/${userInfo.username}/reviews`, {
        method: 'GET',
        params: {
            page,
            booksPerPage
        }
    })
    userReviews.value = res
    // reset it
    if (userReviews.value) {
        for (let i = 0; i < userReviews.value.length; i++) {
            const res = await $fetch(`/api/volume/${userReviews.value[i].volumeid}`, {
                method: 'GET',
            })

            userReviews.value[i] = {
                ...userReviews.value[i],
                ...res
            }
        }
    }
}

async function refetchReviews() {
    await getPageOfReviews(currentPage.value - 1)
}

function isNotSelf() {
    if (!jwtToken || !jwtToken.value) {
        return true
    }
    
    return (jwtDecode(jwtToken.value) as any).username !== userInfo.username
}

async function followUser() {
    await $fetch(`/api/user/${username}/follows`, {
        method: 'POST'
    })
}

async function unfollowUser() {
    await $fetch(`/api/user/${username}/follows`, {
        method: 'DELETE'
    })
}

</script>