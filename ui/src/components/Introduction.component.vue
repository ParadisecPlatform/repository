<template>
    <div class="px-4">
        <div class="flex justify-center">
            <div class="text-3xl style-heading">OCFL Digital Repository PoC</div>
        </div>
        <div class="flex flex-col mt-5">
            <p>
                This proof of concept is intended to demonstrate a single page application operating over
                an OCFL on-disk repository. In the current configuration, the application enables browsing
                and discovery of the content (collections and items) from multiple domains with graceful degradation
                in the event that the search service is unavailable (discovery will be disabled but browsing directly
                to collections and items will continue to work).
            </p>
        </div>
        <div class="flex mt-5">
            <p>
                The current status of the application can be seen on the
                <router-link to="health-check">health-check</router-link>&nbsp;page.
            </p>
        </div>
        <div class="flex flex-col mt-5">
            <p>
                In this demonstrator the URL path is "/{domain}/{collectionId}/{itemId}".
                <!-- The application can also
                operate in a mode where it focuses on a single domain such that the URL path becomes "/{collectionId}/{itemId}".
                -->
            </p>
            <div class="flex flex-col my-4">
                You can navigate to the collection or item directly viz:
                <div>
                    <router-link to="/paradisec.org.au/AC1">/paradisec.org.au/AC1</router-link>&nbsp;and
                    <router-link to="/paradisec.org.au/AC1/001">/paradisec.org.au/AC1/001</router-link>
                </div>

                <div>
                    <router-link to="/paradisec.org.au/NT1">/paradisec.org.au/NT1</router-link>&nbsp;and
                    <router-link to="/paradisec.org.au/NT1/98007">/paradisec.org.au/NT1/98007</router-link>
                </div>

                <div>
                    <router-link to="/paradisec.org.au/NT5">/paradisec.org.au/NT5</router-link>&nbsp;and
                    <router-link
                        to="/paradisec.org.au/NT5/TokelauOf"
                    >/paradisec.org.au/NT5/TokelauOf</router-link>
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
        configuration: function() {
            return this.$store.state.configuration;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "assets/variables.scss";

.style-heading {
    color: $brand-primary-color;
}
</style>