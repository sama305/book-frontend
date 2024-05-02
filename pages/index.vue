<template>
    <PageHeader>
        <LandingHeader @search="(val) => { searchQuery = val}"/>
    </PageHeader>
    <hr>
    <PageBody>
        Welcome {{ searchQuery }}
    </PageBody>
</template>

<script setup lang="ts">
const { searchQuery } = defineProps<{
    searchQuery: string,
}>()
</script>