<template>
    <div class="tags">
        <el-tag v-for="(tag, index) in tags" :key="tag.name" :closable="tag.name !== 'home'"
            :effect="route.name == tag.name ? 'dark' : 'plain'" @click="handleMenu(tag)"
            @close="handleClose(tag, index)">
            {{ tag.label }}
        </el-tag>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAllDataStore } from '../stores';

const store = useAllDataStore()

const tags = computed(() => store.state.tags)

const route = useRoute()
const router = useRouter()

const handleMenu = (tag) => {
    router.push(tag.name)
    store.selectMenu(tag)
}

const handleClose = (tag, index) => {
    // 通过pinia管理
    store.updateTags(tag)

    console.log('tag :>> ', tag);
    console.log('index :>> ', index);

    // 关闭页面之后还需要跳转到新的页面
    // 如果点击关闭的 tag 不是当前页面对应的 tag，则什么都不用做
    if (tag.name !== route.name) return

    if (index === store.state.tags.length) {
        store.selectMenu(tags.value[index - 1])
        router.push(tags.value[index - 1].name)
    } else {
        store.selectMenu(tags.value[index])
        router.push(tags.value[index].name)
    }
}
</script>

<style lang="less" scoped>
.tags {
    margin: 20px 0 0 20px;
}

.el-tag {
    margin-right: 10px;
}
</style>