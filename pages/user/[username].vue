<template>
    <PageHeader>
        <LandingHeader @post-review="refetchReviews" />
    </PageHeader>

    <hr>

    <PageBody v-if="userInfo">
        <div class="w-4/5 m-auto">
            <div class="grid lg:h-[50vh] lg:gap-[30px] md:gap-[15px] lg:grid-cols-[20%_75%] md:grid-cols lg:grid-rows-2">
                <div class="lg:row-start-1 lg:row-end-2 lg:col-start-1 lg:col-end-2 md:row-start-1 md:row-end-2 md:col-start-1 md:col-end-2">
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
                <div class="lg:row-start-2 lg:row-end-3 lg:col-start-1 lg:col-end-2 md:row-start-1 md:row-end-2 md:col-start-2 md:col-end-3">
                    <UCard class="md:h-full lg:h-fit">
                        <p>Joined {{ strToDate(userInfo.join_date) }}</p>
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
                        <div class="h-full flex flex-col justify-between">
                            <div class="flex flex-wrap justify-start mb-4">
                                <template v-if="userReviews">
                                    <template v-for="rev in userReviews">
                                        <template v-if="rev">
                                            <BookReviewView
                                                :review="rev"
                                                class="md:w-1/2 sm:w-full"
                                                @onOpenReview="navigateTo(`/review/${rev.reviewid}`)"
                                                @delete-review="refetchReviews"
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
        </div>
    </PageBody>
</template>

<script setup lang="ts">
import type { GetUserRes, PatchDescReq, GetVolumeRes } from '~/types';
import { isEmpty, strToDate } from '~/util';
import { jwtDecode } from "jwt-decode"

const booksPerPage = 4;

const username = useRoute().params.username;
const validated = ref(false)
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
    userReviews.value = []
    const res = await $fetch(`/api/user/${userInfo.username}/reviews`, {
        method: 'GET',
        params: {
            page,
            booksPerPage
        },
        headers: {
            "Authorization": `Bearer ${jwtToken.value}`
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

async function onUpdateReview(reviewid: string) {
    const i = userReviews.value.findIndex(r => r.reviewid === reviewid)
    userReviews.value[i] = await $fetch(`/api/review/${reviewid}`, {
        method: 'GET'
    })

    const res = await $fetch(`/api/volume/${userReviews.value[i].volumeid}`, {
        method: 'GET',
    })

    userReviews.value[i] = {
        ...userReviews.value[i],
        ...res
    }
}

</script>