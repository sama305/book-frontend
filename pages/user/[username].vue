<template>
    <PageHeader>
        <LandingHeader />
    </PageHeader>

    <hr>

    <PageBody v-if="userInfo">
        <div class="grid" style="height: 50vh; gap: 30px; grid-template-columns: 20% 75%; grid-template-rows: 320px 320px;">
            <div class="aboutme">
                <UCard class="h-full">
                    <div>
                        <template v-if="!editingDesc">
                            <div class="flex items-center justify-between" style="white-space: pre-wrap;">
                                <template v-if="!isEmpty(userDescription)">
                                    <i>{{ userDescription }}</i>
                                </template>
                                <template v-else>
                                    <i>'{{ userInfo.username }}' hasn't written a profile description yet.</i>
                                </template>
                                <UButton size="sm" icon="i-heroicons-pencil-square-16-solid" square class="w-fit" v-if="validated && !editingDesc" @click="editingDesc = true" variant="link" />
                            </div>
                        </template>

                        <div v-else>
                            <UTextarea v-model="userDescription" class="mb-2" placeholder="Tell us a little about yourself..." />
                            <UButton icon="i-heroicons-check-16-solid" @click="editingDesc = false">Save</UButton>
                        </div>
                    </div>
                </UCard>
            </div>
            <div class="other">
                <UCard class="h-full">
                    <p>Joined {{ new Date(userInfo.join_date).toISOString().slice(0,10) }}</p>
                    <UButton variant="ghost">
                        <div class="flex items-center">
                            <UIcon class="mr-2" name="i-heroicons-envelope" />
                            <p>{{ userInfo.email }}</p>
                        </div>
                    </UButton>
                </UCard>
            </div>
            <div class="reviews">
                <UCard class="h-full">
                    <div class="h-[620px] flex flex-col justify-between">
                        <div class="flex flex-wrap justify-start">
                            <template v-if="userReviews">
                                <template v-for="rev in userReviews.slice(0, 4)">
                                    <template v-if="reviewBookData && reviewBookData[rev.reviewid]">
                                        <div class="w-1/2 p-4">
                                            <div class="flex justify-start mb-2">
                                                <img class="w-[110px] h-[160px] mr-4" :src="`https://covers.openlibrary.org/b/id/${reviewBookData[rev.reviewid].cover_i}-M.jpg`"/>
                                                <div class="flex flex-col justify-between">
                                                    <div>
                                                        <p class="font-extralight text-3xl line-clamp-1 overflow-hidden overflow-ellipsis" :title="reviewBookData[rev.reviewid].title">
                                                            {{ reviewBookData[rev.reviewid].title }}
                                                        </p>
                                                        <p class="font-extralight">By J. K. Rowling</p>
                                                    </div>
                                                    <div>
                                                        <p class="text-sm text-gray-400">{{ new Date(rev.post_date).toISOString().slice(0, 10) }}</p>
                                                        <p v-if="rev.rating >= 1" class="font-extrabold">{{ getStars(rev.rating) }}</p>
                                                        <UButton :trailing="true" size="sm" class="p-0" variant="link" icon="i-heroicons-arrow-up-right-16-solid">Full review</UButton>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <p class="text-justify">
                                                    <template v-if="!isEmpty(rev.content)">
                                                        "{{ lorem.slice(0, wordsPerReview) + (lorem.length >= wordsPerReview ? "..." : "") }}"
                                                    </template>
                                                </p>
                                            </div>
                                        </div>
                                    </template>
                                </template>
                            </template>
                        </div>
                        <div>
                            <UPagination :max="5" :page-count="1" :total="5" v-model="currentPage"/>
                        </div>
                    </div>
                </UCard>
            </div>
        </div>
    </PageBody>
</template>

<script setup lang="ts">
import type { GetUserRes, GetUserReviewsRes, HashTable } from '~/types';
import { isEmpty } from '~/util';
import { jwtDecode } from "jwt-decode"

const booksPerPage = 4;
const wordsPerReview = 150;
const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'

const username = useRoute().params.username;
const validated = ref(false)
const jwtToken = useCookie('jwt_token')

const currentPage = ref(1)
const editingDesc = ref(false)
const userDescription = ref('')
const userReviews: Ref<GetUserReviewsRes> = ref([]);
const reviewBookData: Ref<HashTable<any>> = ref({})

const userInfo: GetUserRes = await $fetch(`/api/user/${username}`, {
    method: 'GET'
})

if (userInfo) {
    userDescription.value = userInfo.description;

    await getPageOfReviews(0)

    // validate incoming user
    if (jwtToken && jwtToken.value) {
        const decoded: any = jwtDecode(jwtToken.value)
        if (decoded.username === userInfo.username) {
            validated.value = true
        }
    }
}

watch(currentPage, async (newVal) => {
    await getPageOfReviews(newVal - 1)
})

function getStars(rating: number) {
    rating /= 2.0
    return '★'.repeat(Math.floor(rating)) + ((rating - Math.floor(rating)) !== 0 ? '½' : '')
}

async function getPageOfReviews(page: number) {
    // get user reviews
    userReviews.value = await $fetch(`/api/user/${userInfo.username}/reviews`, {
        method: 'GET',
        params: {
            page,
            booksPerPage
        }
    })
    
    if (userReviews.value) {
        // reset it
        for (let i = 0; i < userReviews.value.length; i++) {
            // if data hasn't been fetched yet, fetch it
            const val = reviewBookData.value[userReviews.value[i].reviewid]
            if (val === undefined) {
                const res: any = await $fetch(`https://openlibrary.org/works/${userReviews.value[i].worksid}.json`, {
                    method: 'GET',
                })

                // create new entry at the review id
                reviewBookData.value[userReviews.value[i].reviewid] = {
                    authors: res.authors,
                    title: res.title,
                    cover_i: res.covers[0] ?? ''
                }
            }
        }
    }
}

</script>

<style scoped>
.aboutme {
    grid-column-start: 1; grid-column-end: 2; grid-row-start: 1; grid-row-end: 2;
}

.other {
    grid-column-start: 1; grid-column-end: 2; grid-row-start: 2; grid-row-end: 3;
}

.reviews {
    grid-column-start: 2; grid-column-end: 3; grid-row-start: 1; grid-row-end: 3;
}
</style>