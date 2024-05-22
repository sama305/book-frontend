<template>
    <div class="w-full">
        <div class="mb-2 flex justify-between">
            <div class="w-full flex items-start justify-between">
                <div>
                    <UserCard
                        :username="comment.username"
                        :title="comment.username"
                        :subtitle="strToDate(comment.post_date)"
                    />
                </div>
                <template v-if="!isEmpty(currentUsername)">
                    <LikeCountButton
                        :init-is-liked="comment.isliked"
                        :init-like-count="comment.likecount"
                        dir="w"
                        @like="likeComment"
                        @unlike="unlikeComment"
                    />
                </template>
            </div>
        </div>
        <div>
            <div v-html="parseComment(comment.content)" class="line-clamp-4"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { jwtDecode } from 'jwt-decode';
import type { CommentInfo } from '~/types';
import { isEmpty, strToDate } from '~/util';

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
}

async function unlikeComment() {
    await $fetch(`/api/comment/${comment.commentid}/likes` ,{
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${jwtToken.value}`
        }
    })
}

function parseComment(content: string) {
    return content.split(' ').map(word => {
        if (word.startsWith('@')) {
            const username = word.slice(1);
            return `<a class="hover:underline text-blue-400" href="/user/${username}">${word}</a>`;
        }
        return word;
    }).join(' ');
}

</script>