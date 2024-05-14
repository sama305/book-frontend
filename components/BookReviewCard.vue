<template>
    <UCard>
        <template #header>
            <div class="flex justify-between">
                <p class="text-3xl font-extralight">
                    {{ review.title }} review
                </p>
                <template v-if="validated">
                    <UDropdown :items="reviewOptions" :popper="{ placement: 'bottom-start' }">
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
import { getStars } from '~/util';

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
        }
    ]
]

const { review, userInfo } = defineProps<{
    review: ReviewView,
    userInfo: GetUserRes
}>()

const validated = ref(false)
const jwtToken = useCookie('jwt_token')

// validate incoming user
if (jwtToken && jwtToken.value) {
    const decoded: any = jwtDecode(jwtToken.value)
    if (decoded.username === userInfo.username) {
        validated.value = true
    }
}

</script>