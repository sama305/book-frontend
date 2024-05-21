<template>
    <div class="flex flex-row-reverse items-center">
        <UButton @click="likeComment" :class="{ scaled: isScaled }" variant="link" :color="isLiked ? `red`: `black`">
            <UIcon dynamic size="25" :name="isLiked ? `mdi:cards-heart` : `mdi:cards-heart-outline`" />
        </UButton>
        <p class="text-xl font-semibold">{{ likeCount }}</p>
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['like', 'unlike'])
const isScaled = ref(false)

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
        scaleUp()
        likeCount.value += 1;
        emit('like', likeCount.value)
    }
    isLiked.value = !isLiked.value
}

function scaleUp() {
    isScaled.value = true
    setTimeout(() => {
        isScaled.value = false
    }, 200)
}

</script>

<style scoped>
button {
    transition: transform 0.25s ease;
}

button.scaled {
    transform: scaleY(1.2) scaleX(0.83);
}
</style>