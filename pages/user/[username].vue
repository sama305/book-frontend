<template>
    <PageHeader>
        <LandingHeader />
    </PageHeader>

    <hr>

    <PageBody v-if="userInfo">
        <div class="grid" style="height: 50vh; gap: 30px; grid-template-columns: auto auto auto; grid-template-rows: auto auto;">
            <div class="aboutme w-full">
                <UCard class="h-full">
                    <div>
                        <p class="text-2xl font-semibold">About {{ userInfo.username }}...</p>
                        <template v-if="!editingDesc">
                            <div v-if="!isEmpty(userDescription)" style="white-space: pre-wrap;">
                                "<i>{{ userDescription }}</i>"
                            </div>
                            <div class="flex items-center justify-between">
                                <i>No description provided.</i>
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
                    <p class="text-2xl font-semibold mb-2">Book Reviews</p>
                    <div v-if="reviewBookData && userReviews" class="flex flex-wrap justify-start">
                        <template v-for="(rev, i) in userReviews.slice(0, 4)">
                            <div class="flex justify-start w-1/2 mb-4">
                                <div>
                                    <img :src="`https://covers.openlibrary.org/b/id/${reviewBookData[i].cover_i}-M.jpg`" style="width: 130px; height: 200px;"/>
                                </div>
                                <div class="flex-1 ml-2">
                                    <div class="h-[160px] flex flex-col justify-between">
                                        <div>
                                            <p class="font-extralight text-3xl">{{ reviewBookData[i].title }}</p>
                                            <p class="font-extralight">By J. K. Rowling</p>
                                            <p>{{ getStars(rev.rating) }}</p>
                                        </div>
                                        <div class="p-4">
                                            <div v-if="!isEmpty(rev.content)" style="white-space: pre-wrap;">
                                                "{{ rev.content }}""
                                            </div>
                                            <template v-else>
                                                <i>No review provided.</i>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template v-if="userReviews && userReviews.length > 4">
                            <UButton variant="link">
                                See more reviews ({{ userReviews.length - 4 }} more)
                            </UButton>
                        </template>
                    </div>
                </UCard>
            </div>
        </div>
    </PageBody>
</template>

<script setup lang="ts">
import type { GetUserRes, GetUserReviewsRes } from '~/types';
import { isEmpty } from '~/util';
import { jwtDecode } from "jwt-decode"

const username = useRoute().params.username;
const validated = ref(false)
const jwtToken = useCookie('jwt_token')

const editingDesc = ref(false)
const userDescription = ref('')
const userReviews: Ref<GetUserReviewsRes> = ref([]);
const reviewBookData: Ref<any> = ref([])

const userInfo: GetUserRes = await $fetch(`/api/user/${username}`, {
    method: 'GET'
})

if (userInfo) {
    userDescription.value = userInfo.description;

    // get user reviews
    userReviews.value = await $fetch(`/api/user/${userInfo.username}/reviews`, {
        method: 'GET'
    })
    
    if (userReviews.value) {
        for (let i = 0; i < userReviews.value.length; i++) {
        // userReviews.value.forEach(async (rev) => {
            const res: any = await $fetch(`https://openlibrary.org/works/${userReviews.value[i].worksid}.json`)
            reviewBookData.value.push({
                authors: res.authors,
                title: res.title,
                cover_i: res.covers[0] ?? ''
            })
        }
    }

    // validate incoming user
    if (jwtToken && jwtToken.value) {
        const decoded: any = jwtDecode(jwtToken.value)
        if (decoded.username === userInfo.username) {
            validated.value = true
        }
    }
}

function getStars(rating: number) {
    rating /= 2.0
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating))
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
    grid-column-start: 2; grid-column-end: 4; grid-row-start: 1; grid-row-end: 3;
}
</style>