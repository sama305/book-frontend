<template>
    <PageHeader>
        <LandingHeader />
    </PageHeader>

    <hr>
    <PageBody>
        <div class="w-4/5 m-auto">
            <div class="w-full mb-16">
                <div>
                    <div class="h-full w-fit m-auto">
                        <div class="flex justify-between">
                            <div class="flex mb-4">
                                <div class="mr-4 h-[160px] max-w-[100px] min-w-[100px]">
                                    <a :href="`/book/${reviewInfo.volumeid}`">
                                        <img class="shadow-md rounded-md w-full h-full" :src="bookInfo.cover" />
                                    </a>
                                </div>
                                <div>
                                    <div class="mb-2">
                                        <p class="text-3xl font-extralight"><i>{{ bookInfo.title }}</i></p>
                                        <p>By {{ formatArrAsSentence(bookInfo.authors) }}</p>
                                    </div>
                                    <div class="flex items-center">
                                        <ProfilePicture class="mr-2" :username="reviewInfo.username" />
                                        <div>
                                            <p class="text-lg font-extralight">{{ getStars(reviewInfo.rating) }}</p>
                                            <p class="text-gray-400">{{ strToDate(reviewInfo.post_date) }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-col ml-8">
                                <UTextarea class="w-64" placeholder="Write a comment..." v-model="commentBody" />
                                <UButton
                                    class="p-2 w-fit h-fit"
                                    icon="i-heroicons-chat-bubble-left-right-16-solid"
                                    @click="postComment"
                                    variant="link"
                                    :disabled="isEmpty(commentBody)"
                                >
                                    Post Comment
                                </UButton>
                            </div>
                        </div>
                        <div class="flex">
                            <div class="flex">
                                <UIcon class="min-w-[20px]" size="20" dynamic name="mdi:format-quote-open"/>
                                <div class="p-2">
                                    <p class="text-lg font-light">
                                        {{ reviewInfo.content }}  <UIcon size="20" dynamic name="mdi:format-quote-close"/>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="lg:w-3/5 md:w-full m-auto">
                <UCard>
                    <div class="mb-12 min-h-80">
                        <template v-for="c in comments">
                            <Comment class="mb-4" :comment="c" />
                        </template>
                    </div>
                    <UPagination :max="5" :page-count="1" :total="numPages" v-model="currentPage"/>
                </UCard>
            </div>
        </div>
    </PageBody>
</template>

<script setup lang="ts">
import { formatArrAsSentence, getStars, isEmpty, strToDate } from '~/util';
import type { GetReviewCommentsRes, PostReviewCommentReq } from '~/types'

const reviewid = useRoute().params.reviewid
const jwtToken = useCookie('jwt_token')

const commentBody = ref('')
const currentPage = ref(1)
const commentsPerPage = 12


const reviewInfo = await $fetch(`/api/review/${reviewid}`, {
    method: 'GET'
})
const bookInfo = await $fetch(`/api/volume/${reviewInfo.volumeid}`, {
    method: 'GET'
})

const numPages = ref(1)
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
        },
        headers: {
            "Authorization": `Bearer ${jwtToken.value}`
        }
    })
    
    comments.value = res

    await calcNumPages()
}

async function postComment() {
    await $fetch(`/api/review/${reviewInfo.reviewid}/comments`, {
        method: 'POST',
        body: <PostReviewCommentReq>{
            content: commentBody.value
        },
        headers: {
            "Authorization": `Bearer ${jwtToken.value}`
        }
    })
    await getPageOfComments(currentPage.value - 1)
    commentBody.value = ''
}

async function calcNumPages() {
    const stats = await $fetch(`/api/review/${reviewid}/stats`, {
        method: 'GET'
    })
    numPages.value = Math.ceil(stats.commentcount / 12)
}

</script>