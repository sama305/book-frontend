<template>
    <div class="h-64">
        <div class="flex justify-start mb-2">
            <div class="w-[90px] h-[145px] min-w-[90px] min-h-[145px] mr-4">
                <a :href="`/book/${review.volumeid}`">
                    <template v-if="review.cover">
                        <img width="110" height="145" class="shadow-md rounded w-full h-full" :src="review.cover" />
                    </template>
                    <USkeleton v-else class="w-full h-full" />
                </a>
            </div>
            <div class="w-full flex flex-col justify-between">
                <div>
                    <p class="text-xl line-clamp-1 italic overflow-hidden overflow-ellipsis" :title="review.title">
                        <template v-if="review.title">
                            {{ review.title }}
                        </template>
                        <USkeleton v-else class="h-full w-full"></USkeleton>
                    </p>
                    <template v-if="review.authors">
                        <p>By {{ formatArrAsSentence(review.authors) }}</p>
                    </template>
                    <USkeleton v-else class="h-full w-full" />
                </div>
                <div class="flex justify-between items-end">
                    <div>
                        <p class="text-sm text-gray-400">{{ strToDate(review.post_date) }}</p>
                        <p v-if="review.rating >= 1" class="font-extrabold">{{ getStars(review.rating) }}</p>
                        <UButton @click="$emit('onOpenReview', review)" :trailing="true" size="sm" class="p-0" variant="link" icon="i-heroicons-arrow-up-right-16-solid">Full review</UButton>
                    </div>
                    <div class="flex">
                        <template v-if="validated">
                            <UDropdown :items="reviewOptions" :popper="{ offsetDistance: 0, placement: 'bottom-start' }" class="mr-4">
                                <UButton color="black" size="sm" square icon="i-heroicons-ellipsis-horizontal-16-solid" variant="link" />
                            </UDropdown>
                        </template>
                        <LikeCountButton
                            :init-is-liked="review.isliked"
                            :init-like-count="review.likecount"
                            dir="w"
                            @like="onLikeReview(review.reviewid)"
                            @unlike="onUnlikeReview(review.reviewid)"
                        />
                    </div>
                </div>
            </div>
        </div>
        <p class="line-clamp-3 overflow-hidden overflow-ellipsis">
            <template v-if="review.content">
                {{ review.content }}
            </template>
            <template v-else>
                No review given.
            </template>
        </p>
    </div>

    <UModal v-model="isEditing">
        <UpdateReviewCard
            @update-review="onUpdateReview"
            :review="review"
        />
    </UModal>
</template>

<script setup lang="ts">
import { jwtDecode } from 'jwt-decode';
import type { PutReviewReq, ReviewView } from '~/types';
import { formatArrAsSentence, getStars, strToDate } from '~/util';

const emit = defineEmits(['deleteReview', 'onOpenReview', 'updateReview'])

const { review } = defineProps<{
    review: ReviewView
}>()

const jwtToken = useCookie('jwt_token')

const validated = ref(false)

const isEditing = ref(false)

// validate incoming user
if (jwtToken && jwtToken.value) {
    const decoded: any = jwtDecode(jwtToken.value)
    if (decoded.username === review.username) {
        validated.value = true
    }
}

const reviewOptions = [
    [
        {
            label: 'Edit content',
            icon: 'i-heroicons-pencil-16-solid',
            click: () => {
                isEditing.value = true
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
                    method: 'DELETE',
                    headers: {
                        "Authorization": `Bearer ${jwtToken.value}`
                    }
                })
                emit('deleteReview')
            }
        }
    ]
]

async function onLikeReview(reviewid: string) {
    await $fetch(`/api/review/${reviewid}/likes`, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${jwtToken.value}`
        }
    })
}

async function onUnlikeReview(reviewid: string) {
    await $fetch(`/api/review/${reviewid}/likes`, {
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${jwtToken.value}`
        }
    })
}

async function onUpdateReview() {
    emit('updateReview')
    isEditing.value = false
}

</script>