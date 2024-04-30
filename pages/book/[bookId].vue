<template>
Book {{ bookId }}
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const bookId = useRoute().params.bookId
</script>