<template>
    <PageHeader>
        <LandingHeader />
    </PageHeader>

    <hr>
    <PageBody>
        <div class="w-4/5 m-auto flex">
            <div class="w-1/2 mr-4">
                <div class="flex justify-between mb-4">
                    <div class="flex">
                        <div class="min-w-16 max-w-16 min-h-24 max-h-24 mr-4">
                            <a :href="`/book/${reviewInfo.volumeid}`">
                                <img class="shadow-md rounded-md" :src="bookInfo.cover" />
                            </a>
                        </div>
                        <div>
                            <p class="text-xl line-clamp-2">{{ bookInfo.title }}</p>
                            <p>By {{ formatArrAsSentence(bookInfo.authors) }}</p>
                        </div>
                    </div>
                    <div class="flex flex-col w-64">
                        <UTextarea placeholder="Write a comment..." v-model="commentBody" />
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
                <UCard class="mb-4">
                    <UserCard
                        :username="reviewInfo.username"
                        :title="getStars(reviewInfo.rating)"
                        :subtitle="strToDate(reviewInfo.post_date)"
                        class="mb-4"
                    />
                    <p>{{ reviewInfo.content }}</p>
                </UCard>
            </div>
            <UCard class="w-1/2">
                <div>
                    <div class="mb-8" v-for="c in comments">
                        <UserCard
                            :username="c.username"
                            :title="c.username"
                            :subtitle="strToDate(c.post_date)"
                        />
                        <p v-html="parseComment(c.content)"></p>
                    </div>
                </div>
                <UPagination :max="5" :page-count="1" :total="numPages" v-model="currentPage"/>
            </UCard>
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
const commentsPerPage = 4


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
    numPages.value = Math.ceil(stats.commentcount / commentsPerPage)
}

function parseComment(content: string) {
    return content.split(' ').map(word => {
        if (word.startsWith('@')) {
            const username = word.slice(1);
            return `<a class="hover:underline text-blue-400" href="/user/${username}">${word}</a>`;
        }
        return word;
    }).join(' ');
}

</script>