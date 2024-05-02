<template>
    <UCard>
        <p class="text-s font-thin">Book Search</p>
        <UInput 
            placeholder="Search..."
            icon="i-heroicons-magnifying-glass-20-solid"
            class="mb-4"
            padded
            v-model="rawSearchInput"
        />
        
        <!-- Book search results -->
        <!-- <div class="grid grid-cols-4">
            <div class="mr-4" v-for="b in books">
                <p>{{ b.title }}</p>
                <img :src="b.imgUrl" />
            </div>
        </div> -->
        <div class="h-80">
            <UCarousel v-slot="{ item }" :items="books">
                <div style="transition: opacity 0.8s ease; position: relative;" :class="isLoading ? 'loading' : ''" class="w-64">
                    <img class="book-img" :src="item.imgUrl" />
                    <p class="book-title text-2xl text-white" style="text-shadow: 2px 2px 12px #000000; width: 200px; position: absolute; top: 10px; left: 10px">{{ item.title }}</p>
                </div>
            </UCarousel>
        </div>
        <div class="h-full">
            <p class="text-s font-thin">Stars (<i>optional</i>)</p>
            <p class="text-s font-thin">Review body (<i>optional</i>)</p>
            <UTextarea class="mb-4" variant="outline" placeholder="Type something here..." />
            <UButton>Post Review</UButton>
        </div>
    </UCard>
</template>

<script setup lang="ts">
import { debounce } from 'vue-debounce'

const searchQuery = ref('')
const rawSearchInput = ref('')

watch(rawSearchInput, debounce(() => {
    searchQuery.value = rawSearchInput.value;
}, 400))

const isLoading = computed(() => searchQuery.value != rawSearchInput.value)

const books = [
    {
        title: "Harry Potter and the Sorcerer's Stone",
        imgUrl: "https://picsum.photos/200/300?grayscale"
    },
    {
        title: "test book",
        imgUrl: "https://picsum.photos/200/300?grayscale?random=1"
    },
    {
        title: "test book",
        imgUrl: "https://picsum.photos/200/300?grayscale?random=2"
    },
    {
        title: "test book",
        imgUrl: "https://picsum.photos/200/300?grayscale?random=3"
    },
    {
        title: "test book",
        imgUrl: "https://picsum.photos/200/300?grayscale?random=4"
    },
    {
        title: "test book",
        imgUrl: "https://picsum.photos/200/300?grayscale?random=5"
    },
    {
        title: "test book",
        imgUrl: "https://picsum.photos/200/300?grayscale?random=6"
    },
    {
        title: "test book",
        imgUrl: "https://picsum.photos/200/300?grayscale?random=7"
    },
    {
        title: "test book",
        imgUrl: "https://picsum.photos/200/300?grayscale?random=8"
    },
    {
        title: "test book",
        imgUrl: "https://picsum.photos/200/300?grayscale?random=9"
    },
    {
        title: "test book",
        imgUrl: "https://picsum.photos/200/300?grayscale?random=10"
    },
    {
        title: "test book",
        imgUrl: "https://picsum.photos/200/300?grayscale?random=11"
    }
]
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
</style>