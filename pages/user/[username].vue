<template>
    <PageHeader>
        <div>
            <p class="inline-block text-3xl mr-8">{{ username }}'s profile</p>
        </div>
    </PageHeader>

    <hr>

    <PageBody>
        <p v-if="!isEmpty(userInfo.description)">About me: {{ userInfo.description }}</p>
        <p>Joined {{ new Date(userInfo.join_date).toISOString().substring(0, 10) }}</p>
        <p>{{ userInfo.email }}</p>
    </PageBody>
</template>

<script setup lang="ts">
import type { GetUserRes } from '~/types';
import { isEmpty } from '~/util';

const username = useRoute().params.username;

const userInfo: GetUserRes = await $fetch(`/api/user/${username}`, {
    method: 'GET'
})

</script>