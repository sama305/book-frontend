<template>
    <UCard style="transition: height 0.8 ease;">
        <UInput 
            placeholder="Search for a book..."
            icon="i-heroicons-magnifying-glass-20-solid"
            class="mb-4"
            padded
            v-model="rawSearchInput"
        />
        <div class="h-72 mb-4">
            <template v-if="selectedReviewBook === undefined">
                <div>
                    <UCarousel v-slot="{ item }" :items="results">
                        <div @click="selectedReviewBook = item" style="transition: opacity 0.8s ease; position: relative;" :class="isLoading ? 'loading' : ''" class="flex book">
                            <img width="200" class="book-img" :src="`https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`" />
                            <p class="book-title text-2xl text-white" style="text-shadow: 2px 2px 12px #000000; width: 200px; position: absolute; top: 10px; left: 10px">{{ item.title }}</p>
                        </div>
                    </UCarousel>
                </div>
                <template v-if="isLoading">
                    <div class="absolute top-0 left-0 h-3/4 w-full m-auto flex justify-center">
                        <UIcon size="20px" class="self-center" dynamic name="svg-spinners:bars-rotate-fade"/>
                    </div>
                </template>
            </template>
            <template v-else>
                <div class="flex">
                    <img class="book" style="float: left" :src="`https://covers.openlibrary.org/b/id/${selectedReviewBook.cover_i}-M.jpg`" />
                    <div class="ml-4 flex flex-col justify-between">
                        <div>
                            <p class="text-2xl font-light">{{ selectedReviewBook.title }}</p>
                            <p>By {{ selectedReviewBook.author_name }}</p>
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
            <UInput min="0" max="10" type="number" v-model="reviewStars" />
            <p class="text-s font-thin">Review body (<i>optional</i>)</p>
            <UTextarea class="mb-4" variant="outline" placeholder="Type something here..." v-model="reviewContent" />
            <UButton icon="i-heroicons-check-16-solid" :disabled="!canPostReview(selectedReviewBook)" @click="postReview">Post Review</UButton>
        </div>
    </UCard>
</template>

<script setup lang="ts">
import { debounce } from 'vue-debounce'
import { type BookSearchInfo, type PostReviewReq, type PostReviewRes } from "~/types"

const emit = defineEmits(['postReview'])

const jwtToken = useCookie('jwt_token')

const searchQuery = ref('')
const rawSearchInput = ref('')

const reviewContent = ref('')
const reviewStars = ref(0)

watch(rawSearchInput, debounce(async () => {
    try {
        const res: {
            results: Array<BookSearchInfo>,
            numFound: number,
        } = await $fetch('/api/search/query', {
            method: 'POST',
            body: {
                query: rawSearchInput.value
            }
        })

        results.value = res.results
    }
    catch(e: any) {
        console.error(e)
        const toast = useToast()
        toast.add({
            title: 'Oops! An error with the OpenLibrary servers occured.'
        })
    }

    searchQuery.value = rawSearchInput.value
}, 400))

const isLoading = computed(() => searchQuery.value != rawSearchInput.value)

const selectedReviewBook: Ref<BookSearchInfo | undefined> = ref(undefined)
const results: Ref<Array<BookSearchInfo>> = ref([])
    
function canPostReview(book: BookSearchInfo | undefined) {
    return book !== undefined
}

async function postReview() {
    const res: PostReviewRes = await $fetch('/api/review', {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${jwtToken.value}`
        },
        body: <PostReviewReq>{
            content: reviewContent.value,
            rating: reviewStars.value,
            worksid: selectedReviewBook.value?.key.slice(7)
        }
    })
    emit('postReview', res.reviewid)
}

</script>

<style>
.loading {
    opacity: 50%;
}

.book-img:hover {
    opacity: 75%;
}

.book-img {
    transition: opacity 0.4s ease;
}

.book-title {
    transition: opacity 0.4s ease;
    opacity: 0%;
}

.book-img:hover ~ .book-title {
    opacity: 100%;
}

.book {
    max-height: 300px;
    min-height: 300px;
    max-width: 200px;
    min-width: 200px;
}

</style>