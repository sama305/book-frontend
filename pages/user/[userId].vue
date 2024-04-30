<template>
User {{ userId }}
</template>

<script setup lang="ts">
const userId = useRoute().params.userId;
</script>