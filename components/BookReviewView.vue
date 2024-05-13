<template>
    <div class="w-1/2 p-4">
        <div class="flex justify-start mb-2">
            <template v-if="review.cover_i">
                <img class="w-[110px] h-[145px] mr-4" :src="`https://covers.openlibrary.org/b/id/${review.cover_i}-M.jpg`"/>
            </template>
            <template v-else>
                <USkeleton class="w-[110px] h-[145px] mr-4" />
            </template>
            <div class="flex flex-col justify-between">
                <div>
                    <p class="font-extralight text-3xl line-clamp-1 overflow-hidden overflow-ellipsis" :title="review.title">
                        {{ review.title }}
                    </p>
                    <p class="font-extralight">By J. K. Rowling</p>
                </div>
                <div>
                    <p class="text-sm text-gray-400">{{ new Date(review.post_date).toISOString().slice(0, 10) }}</p>
                    <p v-if="review.rating >= 1" class="font-extrabold">{{ getStars(review.rating) }}</p>
                    <UButton :trailing="true" size="sm" class="p-0" variant="link" icon="i-heroicons-arrow-up-right-16-solid">Full review</UButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ReviewView } from '~/types';

const { review } = defineProps<{
    review: ReviewView
}>()

function getStars(rating: number) {
    rating /= 2.0
    return '★'.repeat(Math.floor(rating)) + ((rating - Math.floor(rating)) !== 0 ? '½' : '')
}

</script>