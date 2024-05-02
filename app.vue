<template>
    <div class="p-4 flex justify-between">
        <LandingHeader @search="(val) => { searchQuery = val}"/>
    </div>
    <hr>
    <div class="p-4">
        <NuxtPage :searchQuery="searchQuery"/>
    </div>
    <UNotifications/>
</template>

<script setup lang="ts">
const searchQuery = ref('')
</script>