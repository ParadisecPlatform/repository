<template>
    <div class="container mx-auto flex flex-col items-center text-2xl">
        <div class="flex-1 p-5 text-center" v-if="showRepositoryErrorMessage">
            <p class="mt-10">Unfortunately, the respository is unavailable at this time.</p>
            <p class="mt-10">Please notify the maintainers of this service.</p>
        </div>
        <div class="flex-1 p-5 text-center" v-if="!showRepositoryErrorMessage">
            <p class="mt-10">Everything looks to be A'OK</p>
        </div>
        <div class="flex-1 p-5 text-center">
            <div class="flex flex-col">
                <div class="text-left">
                    <span class="style-service">API:</span>
                    <span v-show="status.api === undefined">disabled</span>
                    <span v-show="status.api === true" class="style-positive-check">
                        <i class="far fa-check-square"></i>
                    </span>
                    <span v-show="status.api === false" class="style-negative-check">
                        <i class="far fa-times-circle"></i>
                    </span>
                </div>
                <div class="text-left">
                    <span class="style-service">Repository:</span>
                    <span v-show="status.ocfl === undefined">disabled</span>
                    <span v-show="status.ocfl === true" class="style-positive-check">
                        <i class="far fa-check-square"></i>
                    </span>
                    <span v-show="status.ocfl === false" class="style-negative-check">
                        <i class="far fa-times-circle"></i>
                    </span>
                </div>
                <div class="text-left">
                    <span class="style-service">Search:</span>
                    <span v-show="status.search === undefined">disabled</span>
                    <span v-show="status.search === true" class="style-positive-check">
                        <i class="far fa-check-square"></i>
                    </span>
                    <span v-show="status.search === false" class="style-negative-check">
                        <i class="far fa-times-circle"></i>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },
    computed: {
        status: function() {
            return this.$store.state.status;
        },
        showRepositoryErrorMessage: function() {
            const status = this.$store.state.status;
            return status.api || (status.ocfl && status.search) ? false : true;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "src/assets/variables.scss";

.style-service {
    min-width: 200px;
    display: inline-block;
}

.style-positive-check {
    color: $brand-success-color;
}

.style-negative-check {
    color: $brand-error-color;
}
</style>