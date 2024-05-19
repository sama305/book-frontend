<template>
    <div class="flex items-center">
        <div @mouseenter="hovering = true" @mouseleave="hovering = false" class="flex">
            <template v-for="i in 5">
                <UIcon
                    :size="starSize"
                    @mouseover="handleMouseOver($event, i)"
                    @click="selectStar($event, i)"
                    dynamic
                    :name="i * 2 <= hoveredStar ? `mdi:star` : (i * 2 - 1 === hoveredStar ? `mdi:star-half-full` : `mdi:star-outline`)"
                    class="star"
                />
            </template>
        </div>
        <div class="w-4 h-8">
            <template v-if="defaultStar != 0">
                <UButton @click="reset" variant="link" color="black" icon="i-heroicons-x-mark-16-solid" />
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
const hoveredStar = ref(0)
const defaultStar = ref(0)
const hovering = ref(false)

const starSize = 30
const emit = defineEmits(['selectStar'])

watch(hovering, newVal => {
    if (newVal === false) {
        hoveredStar.value = defaultStar.value
    }
})

function handleMouseOver(event: MouseEvent, star: number) {
    if (event.offsetX < Math.floor(starSize / 2)) {
        hoveredStar.value = star * 2 - 1
    }
    else {
        hoveredStar.value = star * 2
    }
}

function selectStar(event: MouseEvent, star: number) {
    if (event.offsetX < Math.floor(starSize / 2)) {
        defaultStar.value = star * 2 - 1
    }
    else {
        defaultStar.value = star * 2
    }
    emit('selectStar', defaultStar.value)
}

function reset() {
    defaultStar.value = 0
    hoveredStar.value = 0
    emit('selectStar', 0)
}

</script>