<template>
    <a :href="`/user/${username}`">
        <UAvatar size="xl" :alt="username.toUpperCase()" />
    </a>
</template>

<script setup lang="ts">
const { username } = defineProps<{
    username: string,
}>()
</script>