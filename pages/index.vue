<template>
    Welcome {{ searchQuery }}
</template>

<script setup lang="ts">
const { searchQuery } = defineProps<{
    searchQuery: string,
}>()
</script>