<template>
    <PageHeader>
        <LandingHeader />
    </PageHeader>

    <hr>
    
    <PageBody>
        <div class="w-4/5 m-auto">
            <div class="flex mb-8">
                <div class="basis-full flex justify-between">
                    <div class="flex">
                        <div class="mr-4 h-full">
                            <a :href="`/book/${volumeid}`">
                                <img class="shadow-md rounded-xl" :src="bookInfo.cover" />
                            </a>
                        </div>
                        <div class="flex flex-col justify-between">
                            <div>
                                <p class="text-xl italic">{{ bookInfo.title }}</p>
                                <p class="text-lg">By {{ formatArrAsSentence(bookInfo.authors) }}</p>
                                <p class="text-sm text-gray-400">Published 2014</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-400">{{ bookStats.reviewcount }} reviews with an average rating of {{ getStars(bookStats.avgrating) }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <UCard class="basis-full">
                    <div class="mb-4 line-clamp-5" v-html="`<p>${bookInfo.description}</p>`"></div>
                    <template v-if="bookInfo.description.length > 400">
                        <UButton @click="showDesc" variant="link" class="p-0">
                            Show More
                        </UButton>
                    </template>
                </UCard>
            </div>
            <div>
                <UCard>
                    <div class="mb-16 grid grid-cols-2 gap-12">
                        <template v-for="rev in reviews">
                            <UserReviewView :review="rev"/>
                        </template>
                    </div>
                    <UPagination :max="5" :page-count="1" :total="numPages" v-model="currentPage"/>
                </UCard>
            </div>
        </div>
    </PageBody>

    <UModal v-model="descModal">
        <UCard>
            <p class="mb-4 font-light" v-html="bookInfo.description"></p>
        </UCard>
    </UModal>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import type { GetVolumeReviewsRes } from '~/types';
import { formatArrAsSentence, getStars } from '~/util';

const jwtToken = useCookie('jwt_token')
const volumeid = useRoute().params.volumeid
const descModal = ref(false)
const currentPage = ref(1)
const reviewsPerPage = 4

const bookInfo = await $fetch(`/api/volume/${volumeid}`, {
    method: 'GET'
})

const reviews: Ref<GetVolumeReviewsRes> = ref([])
await getPageOfReviews(0)

const bookStats = await $fetch(`/api/volume/${volumeid}/stats`, {
    method: 'GET'
})

const numPages = Math.ceil(bookStats.reviewcount / reviewsPerPage)


watch(currentPage, async (newVal) => {
    await getPageOfReviews(newVal - 1)
})

function showDesc() {
    descModal.value = true
}

async function getPageOfReviews(page: number) {
    // get user reviews
    reviews.value = []
    const res = await $fetch(`/api/volume/${volumeid}/reviews`, {
        method: 'GET',
        params: {
            page,
            reviewsPerPage
        },
        headers: {
            "Authorization": `Bearer ${jwtToken.value}`
        }
    })
    reviews.value = res
}

</script>