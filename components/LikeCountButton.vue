<template>
    <div class="flex flex-col items-center">
        <UButton @click="likeComment" variant="link" color="black">
            <UIcon dynamic size="25" :name="isLiked ? `mdi:cards-heart` : `mdi:cards-heart-outline`" />
        </UButton>
        <p>{{ likeCount }}</p>
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['like', 'unlike'])

const { initLikeCount, initIsLiked } = defineProps<{
    initLikeCount: number,
    initIsLiked: boolean
}>()

const likeCount = ref(initLikeCount)
const isLiked = ref(initIsLiked)

function likeComment() {
    if (isLiked.value) {
        likeCount.value -= 1
        emit('unlike', likeCount.value)
    }
    else {
        likeCount.value += 1;
        emit('like', likeCount.value)
    }
    isLiked.value = !isLiked.value
}

</script>