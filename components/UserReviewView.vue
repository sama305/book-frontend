<template>
    <div>
        <div class="mb-4 flex justify-between">
            <div class="flex items-center">
                <div class="mr-4 h-16 w-16 bg-red-600" style="border-radius: 100%;"></div>
                <div>
                    <p class="text-4xl">{{ review.username }}</p>
                    <UButton :trailing="true" size="sm" class="text-md p-0" variant="link" icon="i-heroicons-arrow-up-right-16-solid">
                        Full review
                    </UButton>
                </div>
            </div>
            <div class="flex flex-col items-end">
                <p class="text-2xl">{{ getStars(review.rating) }}</p>
                <p class="text-gray-400">{{ strToDate(review.post_date) }}</p>
            </div>
        </div>
        <div>
            <p class="line-clamp-4">
                {{ review.content }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { GetReviewRes } from '~/types';
import { getStars, strToDate } from '~/util';

const { review } = defineProps<{
    review: any
}>()

</script>