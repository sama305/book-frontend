<template>
    <div class="w-full">
        <div class="mb-2 flex justify-between">
            <div class="w-full flex items-start justify-between">
                <div class="flex items-center">
                    <ProfilePicture class="mr-4" :username="comment.username" />
                    <div>
                        <p class="text-3xl">{{ comment.username }}</p>
                        <p class="text-gray-400">{{ strToDate(comment.post_date) }}</p>
                    </div>
                </div>
                <div v-if="!isEmpty(currentUsername)" class="flex flex-col items-center">
                    <UButton @click="likeComment" variant="link" color="black">
                        <UIcon dynamic size="25" :name="comment.isliked ? `mdi:cards-heart` : `mdi:cards-heart-outline`" />
                    </UButton>
                    <p>{{ comment.likecount }}</p>
                </div>
            </div>
        </div>
        <div>
            <p class="line-clamp-4">
                {{ comment.content }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { jwtDecode } from 'jwt-decode';
import type { CommentInfo } from '~/types';
import { isEmpty, strToDate } from '~/util';

const emit = defineEmits(['like'])

const { comment } = defineProps<{
    comment: CommentInfo
}>()

const jwtToken = useCookie('jwt_token')
const currentUsername = ref('')

// validate incoming user
if (jwtToken && jwtToken.value) {
    const decoded: any = jwtDecode(jwtToken.value)
    if (decoded.username) {
        currentUsername.value = decoded.username
    }
}

async function likeComment() {
    await $fetch(`/api/comment/${comment.commentid}/likes` ,{
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${jwtToken.value}`
        }
    })
    comment.likecount += 1;
    emit('like', comment.commentid)
}

</script>