<template>
Author {{ authorId }}
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const authorId = useRoute().params.authorId
</script>