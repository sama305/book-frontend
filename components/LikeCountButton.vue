<template>
    <div :class="`flex ${getDir(dir)} items-center`">
        <UButton @click="likeComment" :class="{ scaled: isScaled }" size="sm" variant="link" :color="isLiked ? `red`: `black`">
            <UIcon dynamic size="25" :name="isLiked ? `mdi:cards-heart` : `mdi:cards-heart-outline`" />
        </UButton>
        <p class="font-mono">{{ likeCount }}</p>
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['like', 'unlike'])
const isScaled = ref(false)

const { initLikeCount, initIsLiked, dir } = defineProps<{
    initLikeCount: number,
    initIsLiked: boolean,
    dir: 'n' | 's' | 'e' | 'w'
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

function getDir(dir: string) {
    switch(dir) {
        case 'n':
            return 'flex-col-reverse'
        case 'e':
            return 'flex-row'
        case 's':
            return 'flex-col'
        case 'w':
            return 'flex-row-reverse'
    }
}
//

</script>

<style scoped>
button {
    transition: transform 0.25s ease;
}

button.scaled {
    transform: scaleY(1.2) scaleX(0.83);
}
</style>