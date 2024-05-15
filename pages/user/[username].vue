<template>
    <PageHeader>
        <LandingHeader />
    </PageHeader>

    <hr>

    <PageBody v-if="userInfo">
        <div class="grid" style="height: 50vh; gap: 30px; grid-template-columns: 20% 75%; grid-template-rows: 232px 232px;">
            <div class="aboutme">
                <UCard class="h-full">
                    <div>
                        <template v-if="!editingDesc">
                            <div class="flex items-center justify-between" style="white-space: pre-wrap;">
                                <template v-if="!isEmpty(userDescription)">
                                    {{ userDescription }}
                                </template>
                                <template v-else>
                                    {{ userInfo.username }} hasn't written a profile description yet.
                                </template>
                                <UButton size="sm" icon="i-heroicons-pencil-square-16-solid" square class="w-fit" v-if="validated && !editingDesc" @click="editingDesc = true" variant="link" />
                            </div>
                        </template>

                        <div v-else>
                            <UTextarea v-model="userDescription" class="mb-2" placeholder="Tell us a little about yourself..." />
                            <UButton icon="i-heroicons-check-16-solid" @click="onSaveDesc">Save</UButton>
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
                    <div class="h-[450px] flex flex-col justify-between">
                        <div class="flex flex-wrap justify-start">
                            <template v-if="userReviews">
                                <template v-for="rev in userReviews">
                                    <template v-if="rev">
                                        <BookReviewView
                                            :review="rev"
                                            @onOpenReview="(rev) => {
                                                viewedReview = rev
                                                reviewModal = true
                                            }"
                                        />
                                    </template>
                                </template>
                            </template>
                        </div>
                        <div>
                            <UPagination :max="5" :page-count="1" :total="numPages" v-model="currentPage"/>
                        </div>
                    </div>
                </UCard>
            </div>
        </div>
    </PageBody>

    <UModal v-model="reviewModal">
        <BookReviewCard
            :review="viewedReview!"
            :user-info="userInfo"
            @delete-review="onDeleteReview"
            @update-review="onUpdateReview"
        />
    </UModal>
</template>

<script setup lang="ts">
import type { GetUserRes, ReviewView, PatchDescReq, GetVolumeRes } from '~/types';
import { isEmpty } from '~/util';
import { jwtDecode } from "jwt-decode"

const booksPerPage = 4;

const username = useRoute().params.username;
const validated = ref(false)
const jwtToken = useCookie('jwt_token')

const currentPage = ref(1)
const editingDesc = ref(false)
const reviewModal = ref(false)
const userDescription = ref('')
const viewedReview: Ref<any | undefined> = ref()
const userReviews: Ref<Array<any>> = ref([]);

const userInfo: GetUserRes = await $fetch(`/api/user/${username}`, {
    method: 'GET'
})

const numOfReviews = await $fetch(`/api/user/${userInfo.username}/reviews/count`, {
    method: 'GET'
})
const numPages = Math.ceil(numOfReviews / booksPerPage)


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

async function onSaveDesc() {
    editingDesc.value = false
    await $fetch(`/api/user/${userInfo.username}/description`,
    {
        method: 'PATCH',
        body: <PatchDescReq>{
            description: userDescription.value
        },
        headers: {
            "Authorization": `Bearer ${jwtToken.value}`
        }
    })
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
    
    // reset it
    for (let i = 0; i < userReviews.value.length; i++) {
        const res: GetVolumeRes = await $fetch(`/api/volume/${userReviews.value[i].volumeid}`, {
            method: 'GET',
        })

        userReviews.value[i] = {
            ...userReviews.value[i],
            ...res
        }
    }
}

async function onDeleteReview() {
    reviewModal.value = false
    await getPageOfReviews(currentPage.value - 1)
}

async function onUpdateReview(reviewid: string) {
    const i = userReviews.value.findIndex(r => r.reviewid === reviewid)
    userReviews.value[i] = await $fetch(`/api/review/${reviewid}`, {
        method: 'GET'
    })

    const res: GetVolumeRes = await $fetch(`/api/volume/${userReviews.value[i].volumeid}`, {
        method: 'GET',
    })

    userReviews.value[i] = {
        ...userReviews.value[i],
        ...res
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