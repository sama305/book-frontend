<template>
    <PageHeader>
        <LandingHeader />
    </PageHeader>

    <hr>
    <PageBody>
        <div class="w-4/5 m-auto">
            <div class="min-h-80 w-full flex mb-4 items-start">
                <div class="h-0 w-0 lg:h-full lg:max-w-[200px] lg:min-w-[200px] lg:mr-8">
                    <img class="shadow-md rounded-xl w-full h-full" :src="bookInfo.cover" />
                </div>
                <div class="flex flex-col justify-between h-full w-full">
                    <div class="h-full">
                        <div class="flex lg:flex-row flex-col lg:justify-between lg:items-center">
                            <div class="flex">
                                <div class="mr-4 min-h-16 max-h-16 min-w-16 max-w-16 bg-red-600" style="border-radius: 100%;"></div>
                                <div>
                                    <p class="text-4xl font-extralight"><i>{{ bookInfo.title }}</i> review</p>
                                    <p class="mb-4 text-xl font-extralight">By <UButton
                                        class="p-0 text-xl"
                                        variant="link"
                                        @click="navigateTo(`/user/${reviewInfo.username}`)">
                                            {{ reviewInfo.username }}
                                        </UButton>
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p class="text-5xl font-extralight mb-4">{{ getStars(reviewInfo.rating) }}</p>
                            </div>
                        </div>
                        <div class="flex mb-8">
                            <UIcon class="min-w-[30px]" size="20" dynamic name="mdi:format-quote-open"/>
                            <div class="p-2">
                                <p class="text-lg font-light">
                                    {{ reviewInfo.content }}  <UIcon size="20" dynamic name="mdi:format-quote-close"/>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="flex md:items-center md:flex-row flex-col">
                        <UTextarea class="w-full md:mr-4 mb-4 md:mb-0" placeholder="Write a comment..." />
                        <UButton
                            class="p-2 w-fit h-fit"
                            icon="i-heroicons-chat-bubble-left-right-16-solid"
                        >
                            Post Comment
                        </UButton>
                    </div>
                </div>
            </div>
            <div class="lg:w-4/5 md:w-full m-auto">
                <UCard>
                    <div class="mb-12 min-h-80">
                        <template v-for="c in comments">
                            <Comment class="mb-4" :comment="c" />
                        </template>
                    </div>
                    <UPagination :max="5" :page-count="1" :total="5" v-model="currentPage" />
                </UCard>
            </div>
        </div>
    </PageBody>
</template>

<script setup lang="ts">
import { getStars } from '~/util';
import { type GetReviewCommentsRes } from '~/types'

const reviewid = useRoute().params.reviewid

const addingNewComment = ref(false)
const currentPage = ref(1)
const commentsPerPage = 3

const reviewInfo = await $fetch(`/api/review/${reviewid}`, {
    method: 'GET'
})
const bookInfo = await $fetch(`/api/volume/${reviewInfo.volumeid}`, {
    method: 'GET'
})

const comments: Ref<GetReviewCommentsRes> = ref([])
await getPageOfComments(0)

watch(currentPage, async (newVal) => {
    await getPageOfComments(newVal - 1)
})

async function getPageOfComments(page: number) {
    comments.value = []
    const res = await $fetch(`/api/review/${reviewid}/comments`, {
        method: 'GET',
        query: {
            page,
            commentsPerPage
        }
    })

    comments.value = res
}

</script>