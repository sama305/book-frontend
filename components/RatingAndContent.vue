<template>
    <div class="w-fit m-auto mb-4">
        <StarRating :init-rating="initRating" @select-star="(s) => { rating = s }" />
    </div>
    <p>Review Content</p>
    <UTextarea class="mb-4" variant="outline" placeholder="Type something here..." v-model="content" />
    <UButton :icon="icon" @click="$emit('submit', rating, content)">{{ label }}</UButton>
</template>

<script setup lang="ts">
const { initRating, initContent, label, icon } = withDefaults(defineProps<{
    initRating: number,
    initContent: string,
    label: string,
    icon: string
}>(), {
    initRating: 0,
    initContent: '',
    label: 'Submit',
    icon: ''
})

const rating = ref(initRating)
const content = ref(initContent)

</script>