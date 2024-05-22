<template>
    <div class="flex">
        <div class="mr-2">
            <a :href="`/user/${username}`">
                <UAvatar size="xl" :alt="username.toUpperCase()" />
            </a>
        </div>
        <div>
            <p class="text-2xl">{{ title }}</p>
            <p class="text-gray-400">{{ subtitle }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">

const { username, title, subtitle } = defineProps<{
    username: string,
    title: string,
    subtitle: string
}>()
</script>