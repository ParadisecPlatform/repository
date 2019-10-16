<template>
    <div class="container flex flex-col items-center text-xl">
        <div>
            <div class="text-2xl">About this application</div>
            <p class="my-8 md:px-8">
                This proof of concept is intended to demonstrate a single page application
                operating over an OCFL on-disk repository. In the current configuration, the
                application enables browsing and discovery of the content (collections and items)
                from multiple domains with graceful degradation in the event that the search
                service is unavailable (discovery will be disabled but browsing directly to
                collections and items will continue to work).
            </p>

            <p class="my-8 md:px-8">
                The current status of the application can be seen on the
                <router-link to="/health-check">health-check</router-link>&nbsp;page.
            </p>

            <p
                class="my-8 md:px-8"
            >In this demonstrator the URL path is "/{domain}/{collectionId}/{itemId}".</p>

            <p class="my-8 md:px-8">
                The code for this application is available from @
                <a
                    href="https://github.com/CoEDL/modpdsc"
                    target="_blank"
                >
                    https://github.com/CoEDL/modpdsc
                    <i class="fas fa-external-link-alt fa-fw"></i>
                </a>.
            </p>
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