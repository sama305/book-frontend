<template>
    <PageHeader>
        <LandingHeader />
    </PageHeader>
    <hr>
    <PageBody>
        <div class="w-4/5 m-auto">
            <div class="h-80 flex items-center mb-4">
                <div class="h-full max-w-[250px] min-w-[250px] mr-8">
                    <img class="w-full h-full" :src="bookInfo.cover" />
                </div>
                <div>
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="text-4xl font-extralight italic">{{ bookInfo.title }}</p>
                            <p class="mb-4 text-xl font-extralight">By {{ formatArrAsSentence(bookInfo.authors) }}</p>
                        </div>
                        <div>
                            <p class="text-5xl font-extralight mb-4">★ {{ (bookStats.avgrating / 2).toFixed(2) }}</p>
                        </div>
                    </div>
                    <UCard>
                        <p class="mb-4 font-light line-clamp-5" v-html="bookInfo.description"></p>
                        <template v-if="bookInfo.description.length > 400">
                            <UButton @click="showDesc" variant="link" class="p-0">
                                Show More
                            </UButton>
                        </template>
                    </UCard>
                </div>
            </div>
            <div>
                <UCard>
                    <div class="mb-16 grid grid-cols-2 gap-12">
                        <template v-for="rev in reviews">
                            <UserReviewView :review="rev"/>
                        </template>
                    </div>
                    <UPagination  :max="5" :page-count="1" :total="numPages" v-model="currentPage"/>
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
import { formatArrAsSentence } from '~/util';

const volumeid = useRoute().params.volumeid
const descModal = ref(false)
const currentPage = ref(1)
const reviewsPerPage = 4

const bookInfo = await $fetch(`/api/volume/${volumeid}`, {
    method: 'GET'
})

const reviews = await $fetch(`/api/volume/${volumeid}/reviews`, {
    method: 'GET'
})

const bookStats = await $fetch(`/api/volume/${volumeid}/stats`, {
    method: 'GET'
})

const numPages = Math.ceil(bookStats.reviewcount / reviewsPerPage)

function showDesc() {
    descModal.value = true
}

</script>