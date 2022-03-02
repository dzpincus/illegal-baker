<template>
    <div>
        <h2>Menu Sections</h2>
        <b-button variant="dark">
            Add New Section
            <font-awesome-icon class="pl-2" icon="plus" />
        </b-button>
        <div></div>
    </div>
</template>

<script>
export default {
    data: function () {
        return {
            sections: [],
        };
    },
};
</script>