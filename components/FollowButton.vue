<template>
    <UButton
        @click="toggleFollow"
        class="p-0"
        :icon="isFollowing ? 'i-heroicons-user-minus-16-solid' : 'i-heroicons-user-plus-16-solid'"
        variant="link"
    >
        {{ isFollowing ? 'Following' : 'Follow' }}
    </UButton>
</template>

<script setup lang="ts">
const emit = defineEmits(['follow', 'unfollow'])

const { initIsFollowing } = defineProps<{
    initIsFollowing: boolean
}>()

const isFollowing = ref(initIsFollowing)

function toggleFollow() {
    emit(isFollowing.value ? 'unfollow' : 'follow')
    isFollowing.value = !isFollowing.value
}

</script>