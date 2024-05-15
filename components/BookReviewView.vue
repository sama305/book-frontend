<template>
    <div class="w-1/2 p-4">
        <div class="flex justify-start mb-2">
            <div class="w-[90px] h-[145px] min-w-[90px] min-h-[145px] mr-4">
                <template v-if="review.cover">
                    <img width="110" height="145" class="w-full h-full" :src="review.cover" />
                </template>
                <USkeleton v-else class="w-full h-full" />
            </div>
            <div class="flex flex-col justify-between">
                <div>
                    <p class="font-extralight text-3xl h-10 line-clamp-1 italic overflow-hidden overflow-ellipsis" :title="review.title">
                        <template v-if="review.title">
                            {{ review.title }}
                        </template>
                        <USkeleton v-else class="h-full w-full">das</USkeleton>
                    </p>
                    <template v-if="review.authors">
                        <p class="font-extralight">By {{ formatArrAsSentence(review.authors) }}</p>
                    </template>
                    <USkeleton v-else class="h-full w-full" />
                </div>
                <div>
                    <p class="text-sm text-gray-400">{{ new Date(review.post_date).toISOString().slice(0, 10) }}</p>
                    <p v-if="review.rating >= 1" class="font-extrabold">{{ getStars(review.rating) }}</p>
                    <UButton @click="$emit('onOpenReview', review)" :trailing="true" size="sm" class="p-0" variant="link" icon="i-heroicons-arrow-up-right-16-solid">Full review</UButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ReviewView } from '~/types';
import { formatArrAsSentence, getStars } from '~/util';

const { review } = defineProps<{
    review: ReviewView
}>()

</script>