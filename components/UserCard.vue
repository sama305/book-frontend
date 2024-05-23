<template>
    <div class="flex">
        <div class="mr-2">
            <a :href="`/user/${username}`">
                <UAvatar size="xl" :alt="username.toUpperCase()" />
            </a>
        </div>
        <div>
            <template v-if="title !== undefined">
                <p class="text-2xl">{{ title }}</p>
            </template>
            <template v-else>
                <slot name="title"></slot>
            </template>
            <template v-if="subtitle !== undefined">
                <p class="text-gray-400">{{ subtitle }}</p>
            </template>
            <template v-else>
                <slot name="subtitle"></slot>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">

const { username, title, subtitle } = withDefaults(defineProps<{
    username: string,
    title: string,
    subtitle: string
}>(), {
    title: undefined,
    subtitle: undefined
})
console.log(subtitle)
</script>