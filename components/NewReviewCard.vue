<template>
    <UCard style="transition: height 0.8 ease;">
        <UInput 
            placeholder="Search for a book..."
            icon="i-heroicons-magnifying-glass-20-solid"
            class="mb-4"
            padded
            v-model="rawSearchInput"
        />
        <div class="h-52 mb-4">
            <template v-if="selectedReviewBook === undefined">
                <div class="grid grid-cols-4 grid-rows-1 w-fit">
                    <div v-for="r in pagedResults[currentPage]" class="relative">
                        <div @click="selectedReviewBook = r" class="book-img-container h-[190px] w-[120px]">
                            <div class="book-img pointer-events-none h-full w-full relative">
                                <img class="shadow-md rounded h-full w-full" :src="r.cover" />
                                <div class="absolute top-0 left-0 flex h-full justify-between flex-col">
                                    <p class="text-white book-img-title pl-4 pr-4 pt-2 text-xl italic font-light line-clamp-4">{{ r.title }}</p>
                                    <p class="text-white book-img-title pl-4 pr-4 pb-2 text-xs font-light"> By {{ formatArrAsSentence(r.authors) }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <template v-if="pagedResults.length > 0">
                    <UButton size="sm" class="p-0" :disabled="currentPage === 0" @click="currentPage--" variant="link">Previous</UButton>
                    |
                    <UButton size="sm" class="p-0" @click="currentPage++" variant="link">Next</UButton>
                </template>
                <template v-if="isLoading">
                    <div class="absolute top-0 left-0 h-3/4 w-full m-auto flex justify-center">
                        <UIcon size="20px" class="self-center" dynamic name="svg-spinners:3-dots-scale"/>
                    </div>
                </template>
            </template>
            <template v-else>
                <div class="flex">
                    <img class="book" style="float: left" :src="selectedReviewBook.cover" />
                    <div class="ml-4 flex flex-col justify-between">
                        <div>
                            <p class="text-2xl font-light">{{ selectedReviewBook.title }}</p>
                            <p>By {{ formatArrAsSentence(selectedReviewBook.authors) }}</p>
                        </div>
                        <div>
                            <UButton
                                icon="i-heroicons-x-circle-16-solid"
                                color="white"
                                @click="selectedReviewBook = undefined"
                            >
                                Deselect
                            </UButton>
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <div class="h-full">
            <p class="text-s font-thin">Stars (<i>optional</i>)</p>
            <div class="w-fit m-auto">
                <StarRating @select-star="(s) => { reviewStars = s }" />
            </div>
            <p class="text-s font-thin">Review body (<i>optional</i>)</p>
            <UTextarea class="mb-4" variant="outline" placeholder="Type something here..." v-model="reviewContent" />
            <UButton icon="i-heroicons-check-16-solid" :disabled="!canPostReview(selectedReviewBook)" @click="postReview">Post Review</UButton>
        </div>
    </UCard>
</template>

<script setup lang="ts">
import { debounce } from 'vue-debounce'
import { type BookSearchInfo, type PostReviewReq, type PostReviewRes } from "~/types"
import { isEmpty, formatArrAsSentence } from '~/util';

const emit = defineEmits(['postReview'])

const jwtToken = useCookie('jwt_token')

const searchQuery = ref('')
const rawSearchInput = ref('')

const reviewContent = ref('')
const reviewStars = ref(0)

const isLoading = computed(() => searchQuery.value != rawSearchInput.value)

const selectedReviewBook: Ref<any | undefined> = ref(undefined)
const results: Ref<Array<any>> = ref([])
const pagedResults: Ref<Array<any>> = ref([])
const resultsPerPage = 4;
const currentPage = ref(0)

watch(rawSearchInput, debounce(async (newVal: string) => {
    try {
        if (!isEmpty(newVal)) {
            const res = await $fetch('/api/search/query', {
                method: 'POST',
                body: {
                    query: newVal
                }
            })

            results.value = res
            for (let i = 0; i < Math.ceil(res.length / resultsPerPage); i++) {
                pagedResults.value[i] = results.value.splice(i*resultsPerPage, i*resultsPerPage+resultsPerPage)
            }
        }
    }
    catch(e: any) {
        console.error(e)
        const toast = useToast()
        toast.add({
            title: 'Oops! An error with the OpenLibrary servers occured.'
        })
    }

    searchQuery.value = newVal
}, 400))
    
function canPostReview(book: BookSearchInfo | undefined) {
    return book !== undefined
}

async function postReview() {
    const res = await $fetch('/api/review', {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${jwtToken.value}`
        },
        body: <PostReviewReq>{
            content: reviewContent.value,
            rating: reviewStars.value,
            volumeid: selectedReviewBook.value.volumeid
        }
    })
    emit('postReview', res.reviewid)
}

</script>

<style>
.loading {
    opacity: 50%;
}

.book-img-title {
    opacity: 0%;
    transition: opacity 0.3s ease;
}

.book-img {
    transition: transform 0.5s cubic-bezier(0.215, 0.610, 0.355, 1);
}

.book-img img {
    transition: filter 0.2s ease;
}

.book-img-container:hover .book-img {
    transform: perspective(400px) rotateZ(5deg) scale(2);
    position: relative;
    z-index: 1000;
}

.book-img-container:hover .book-img img {
    filter: brightness(30%);
}

.book-img-container:hover .book-img-title {
    opacity: 100%;
    text-shadow: 1px 1px 2px #000000;
    filter: brightness(100%);
}

</style>