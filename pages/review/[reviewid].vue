<template>
    <PageHeader>
        <LandingHeader />
    </PageHeader>

    <hr>
    <PageBody>
        <div class="w-4/5 m-auto">
            <div class="w-full mb-4">
                <!-- <div class="flex flex-col-reverse"> -->
                    <!-- <div class="flex mb-4">
                        <ProfilePicture class="mr-2" :username="reviewInfo.username" />
                        <div>
                            <p class="">Review by {{ reviewInfo.username }}</p>
                            <p class="text-lg font-extralight">{{ getStars(reviewInfo.rating) }}</p>
                        </div>
                    </div> -->
                <!-- </div> -->
                <div>
                    <div class="h-full w-fit m-auto">
                        <div class="mr-8">
                            <div class="flex mb-4">
                                <div class="mr-4 lg:h-full lg:max-w-[90px] lg:min-w-[90px]">
                                    <a :href="`/book/${reviewInfo.volumeid}`">
                                        <img class="shadow-md rounded-xl w-full h-full" :src="bookInfo.cover" />
                                    </a>
                                </div>
                                <div>
                                    <div class="flex items-center">
                                        <ProfilePicture class="mr-2" :username="reviewInfo.username" />
                                        <div>
                                            <p>Reviewed by <a :href="`/user/${reviewInfo.username}`">{{ reviewInfo.username }}</a></p>
                                            <p class="text-lg font-extralight">{{ getStars(reviewInfo.rating) }}</p>
                                            <p class="text-gray-400">{{ strToDate(reviewInfo.post_date) }}</p>
                                        </div>
                                    </div>
                                    <div class="mb-2">
                                        <p class="text-3xl font-extralight"><i>{{ bookInfo.title }}</i></p>
                                        <p>By {{ formatArrAsSentence(bookInfo.authors) }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex">
                            <div class="flex">
                                <UIcon class="min-w-[30px]" size="20" dynamic name="mdi:format-quote-open"/>
                                <div class="p-2">
                                    <p class="text-lg font-light">
                                        {{ reviewInfo.content }}  <UIcon size="20" dynamic name="mdi:format-quote-close"/>
                                    </p>
                                </div>
                            </div>
                            <div class="flex flex-col ml-8">
                                <UTextarea class="w-64 mb-4" placeholder="Write a comment..." v-model="commentBody" />
                                <UButton
                                    class="p-2 w-fit h-fit"
                                    icon="i-heroicons-chat-bubble-left-right-16-solid"
                                    @click="postComment"
                                    :disabled="isEmpty(commentBody)"
                                >
                                    Post Comment
                                </UButton>
                            </div>
                        </div>
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

</script>