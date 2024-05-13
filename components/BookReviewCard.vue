<template>
    <UCard>
        <template #header>
            <p class="text-3xl font-extralight">
                {{ review.title }} review
            </p>
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
import type { GetUserRes, ReviewView } from '~/types';
import { getStars } from '~/util';

const { review, userInfo } = defineProps<{
    review: ReviewView,
    userInfo: GetUserRes
}>()

</script>