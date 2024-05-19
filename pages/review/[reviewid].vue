<template>
    <PageHeader>
        <LandingHeader />
    </PageHeader>

    <hr>
    <PageBody>
        <div class="w-4/5 m-auto">
            <div class="h-80 w-full flex mb-4 items-center">
                <div class="h-full max-w-[200px] min-w-[200px] mr-8">
                    <img class="shadow-md rounded-xl w-full h-full" :src="bookInfo.cover" />
                </div>
                <div class="w-full">
                    <div class="flex justify-between items-center">
                        <div class="flex">
                            <div class="mr-4 min-h-16 max-h-16 min-w-16 max-w-16 bg-red-600" style="border-radius: 100%;"></div>
                            <div>
                                <p class="text-4xl font-extralight"><i>{{ bookInfo.title }}</i> review</p>
                                <p class="mb-4 text-xl font-extralight">By {{ reviewInfo.username }}</p>
                            </div>
                        </div>
                        <div>
                            <p class="text-5xl font-extralight mb-4">{{ getStars(reviewInfo.rating) }}</p>
                        </div>
                    </div>
                    <p>
                        {{ reviewInfo.content }}
                    </p>
                </div>
            </div>
            <div class="w-4/5 m-auto">
                <UCard>
                    <div class="mb-16">
                        <template v-for="c in comments">
                            <Comment class="mb-4" :comment="c" />
                        </template>
                    </div>
                    <UPagination  :max="5" :page-count="1" :total="5" v-model="currentPage" />
                </UCard>
            </div>
        </div>
    </PageBody>
</template>

<script setup lang="ts">
import { getStars } from '~/util';

const reviewid = useRoute().params.reviewid

const currentPage = ref(1)

const reviewInfo = await $fetch(`/api/review/${reviewid}`)

const bookInfo = await $fetch(`/api/volume/${reviewInfo.volumeid}`, {
    method: 'GET'
})

const comments = await $fetch(`/api/review/${reviewid}/comments`, {
    method: 'GET'
})

</script>