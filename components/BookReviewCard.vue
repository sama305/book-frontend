<template>
    <UCard>
        <template #header>
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-3xl font-extralight italic">
                        {{ review.title }}
                    </p>
                    <p class="font-extralight">By {{ formatArrAsSentence(review.authors) }}</p>
                </div>
                <template v-if="isUserValid(jwtToken, userInfo.username)">
                    <UDropdown :items="reviewOptions" :popper="{ offsetDistance: 0, placement: 'bottom-start' }">
                        <UButton color="black" size="sm" square icon="i-heroicons-ellipsis-horizontal-16-solid" variant="link" />
                    </UDropdown>
                </template>
            </div>
        </template>
        <p v-if="review.rating >= 1" class="font-extrabold mb-2">{{ getStars(review.rating) }}</p>
        <p class="mb-4" v-if="!editingContent && !isEmpty(reviewContent)">
            {{ reviewContent }}
        </p>
        <div class="mb-4" v-else-if="editingContent">
            <UTextarea class="mb-4" variant="outline" placeholder="Type something here..." v-model="reviewContent" />
            <UButton icon="i-heroicons-check-16-solid" @click="updateReview">Update Content</UButton>
        </div>
        <p class="text-sm text-gray-400">
            Posted by {{ userInfo.username}} on {{ strToDate(review.post_date) }}
        </p>
    </UCard>
</template>

<script setup lang="ts">
import { jwtDecode } from 'jwt-decode';
import type { GetUserRes, ReviewView, PutReviewReq } from '~/types';
import { formatArrAsSentence, getStars, isEmpty, isUserValid, strToDate } from '~/util';

const emit = defineEmits(['deleteReview', 'updateReview'])

const { review, userInfo } = defineProps<{
    review: ReviewView,
    userInfo: GetUserRes
}>()

const jwtToken = useCookie('jwt_token')

const editingContent = ref(false)
const reviewContent  = ref(review.content)
const editingRating  = ref(false)
const reviewRating  = ref(review.rating)

const reviewOptions = [
    [
        {
            label: 'Edit content',
            icon: 'i-heroicons-pencil-16-solid',
            click: () => {
                editingContent.value = true
            }
        },
        {
            label: 'Change rating',
            icon: 'i-heroicons-star-16-solid'
        }
    ],
    [
        {
            label: 'Delete this review',
            icon: 'i-heroicons-x-circle-16-solid',
            click: async () => {
                await $fetch(`/api/review/${review.reviewid}`, {
                    method: 'DELETE'
                })
                emit('deleteReview')
            }
        }
    ]
]


async function updateReview() {
    editingContent.value = false
    const res = await $fetch(`/api/review/${review.reviewid}`, {
        method: 'PUT',
        body: <PutReviewReq>{
            content: reviewContent.value,
            rating: reviewRating.value
        }
    })
    emit('updateReview', review.reviewid)
}

</script>