<template>
    <a :href="`/user/${username}`">
        <div class="flex justify-center items-baseline h-12 w-12 shadow-lg" style="border-radius: 100%;">
            <p class="w-fit font-extralight text-4xl">{{ username.at(0)?.toLocaleUpperCase() }}</p>
        </div>
    </a>
</template>

<script setup lang="ts">
const { username } = defineProps<{
    username: string,
}>()
</script>