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
                <template v-if="validated">
                    <UDropdown :items="reviewOptions" :popper="{ offsetDistance: 0, placement: 'bottom-start' }">
                        <UButton color="black" size="sm" square icon="i-heroicons-ellipsis-horizontal-16-solid" variant="link" />
                    </UDropdown>
                </template>
            </div>
        </template>
        <p v-if="review.rating >= 1" class="font-extrabold">{{ getStars(review.rating) }}</p>
        <p class="mb-4">
            {{ review.content }}
        </p>
        <p class="text-sm text-gray-400">
            Posted by {{ userInfo.username}} on {{ new Date(review.post_date).toISOString().slice(0, 10) }}
        </p>
    </UCard>
</template>

<script setup lang="ts">
import { jwtDecode } from 'jwt-decode';
import type { GetUserRes, ReviewView } from '~/types';
import { formatArrAsSentence, getStars } from '~/util';

const emit = defineEmits(['deleteReview'])

const { review, userInfo } = defineProps<{
    review: ReviewView,
    userInfo: GetUserRes
}>()

const validated = ref(false)
const jwtToken = useCookie('jwt_token')

const reviewOptions = [
    [
        {
            label: 'Edit content',
            icon: 'i-heroicons-pencil-16-solid'
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

// validate incoming user
if (jwtToken && jwtToken.value) {
    const decoded: any = jwtDecode(jwtToken.value)
    if (decoded.username === userInfo.username) {
        validated.value = true
    }
}

</script>