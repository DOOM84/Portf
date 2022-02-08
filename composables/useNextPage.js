
export const useNextPage = async (psts, disBut, showIcon, id, path) => {

    if (disBut.value) {
        return
    }

    showIcon.value = true;
    disBut.value = true;

    let lastItemIndex = psts[psts.length - 1].createdAt;
    const {posts} = await $fetch(path,
        {params: {lastTimeStamp: lastItemIndex, slug: id}})

    if (!posts.length) {
        disBut.value = true;
        showIcon.value = false;
        return
    }

    psts.push(...posts);
    showIcon.value = false;
    disBut.value = false;
}