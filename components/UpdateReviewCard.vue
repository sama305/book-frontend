<template>
    <UCard>
        <p class="text-xl">Edit Review for <i>{{ review.title }}</i></p>
        <RatingAndContent
            :init-content="review.content"
            :init-rating="review.rating"
            label="Save Changes"
            @submit="onSaveChanges"
        />
    </UCard>
</template>

<script setup lang="ts">
import type { PutReviewReq, ReviewView } from '~/types';

const { review } = defineProps<{
    review: ReviewView
}>()

const emit = defineEmits(['updateReview'])

async function onSaveChanges(rating: number, content: string) {
    await $fetch(`/api/review/${review.reviewid}`, {
        method: 'PUT',
        body: <PutReviewReq>{
            content,
            rating
        }
    })
    emit('updateReview')
}
</script>