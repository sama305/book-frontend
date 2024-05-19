<template>
    <div class="w-full">
        <div class="mb-2 flex justify-between">
            <div class="w-full flex items-center justify-between">
                <div class="flex items-center">
                    <div class="flex justify-center items-baseline mr-4 h-12 w-12 shadow-lg" style="border-radius: 100%;">
                        <p class="w-fit font-extralight text-4xl">{{ comment.username.at(0)?.toLocaleUpperCase() }}</p>
                    </div>
                    <div>
                        <p class="text-3xl">{{ comment.username }}</p>
                        <p class="text-gray-400">{{ strToDate(comment.post_date) }}</p>
                    </div>
                </div>
                <UButton class="p-4" variant="link" color="black">
                    <UIcon dynamic size="25" name="mdi:cards-heart-outline" />
                </UButton>
            </div>
            <!-- <div class="flex flex-col items-end"> -->
                    <!-- <p class="text-2xl">{{ getStars(review.rating) }}</p>
                <p class="text-gray-400">{{ strToDate(review.post_date) }}</p> -->
            <!-- </div> -->
        </div>
        <div>
            <p class="line-clamp-4">
                {{ comment.content }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { strToDate } from '~/util';

const { comment } = defineProps<{
    comment: {
        content: string,
        username: string,
        commentid: string,
        reviewid: string,
        post_date: string,
        likecount: string,
    }
}>()

</script>