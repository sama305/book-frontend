<template>
    <PageHeader>
        <LandingHeader />
    </PageHeader>

    <hr>
    
    <PageBody>
        <div class="w-4/5 m-auto">
            <div class="h-80 flex items-center mb-4">
                <div class=" h-full max-w-[200px] min-w-[200px] mr-8">
                    <img class="shadow-md rounded-xl w-full h-full" :src="bookInfo.cover" />
                </div>
                <div class="w-full">
                    <div class="flex justify-between items-center">
                        <div>
                            <div>
                                <p class="text-4xl font-extralight italic">{{ bookInfo.title }}</p>
                                <p class="mb-4 text-xl font-extralight">By {{ formatArrAsSentence(bookInfo.authors) }}</p>
                            </div>
                        </div>
                        <div class="w-1/2 flex justify-center">
                            <p class="text-5xl font-extralight mb-4">★ {{ (bookStats.avgrating / 2).toFixed(2) }}</p>
                        </div>
                    </div>
                    <template v-if="bookInfo.description">
                        <UCard>
                            <p class="mb-4 font-light line-clamp-5" v-html="bookInfo.description"></p>
                            <template v-if="bookInfo.description.length > 400">
                                <UButton @click="showDesc" variant="link" class="p-0">
                                    Show More
                                </UButton>
                            </template>
                        </UCard>
                    </template>
                </div>
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
import { formatArrAsSentence } from '~/util';

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