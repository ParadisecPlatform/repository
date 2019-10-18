<template>
    <div class="container flex flex-col items-center text-sm lg:text-lg xl:text-xl">
        <div>
            <div class="flex flex-row">
                <a href="http://www.dynamicsoflanguage.edu.au/" target="_blank">
                    <el-image :src="images[1]" fit="contain" class="style-pdsc-images" />
                </a>
                <div class="flex-grow"></div>
                <a href="http://www.paradisec.org.au/" target="blank">
                    <el-image :src="images[2]" fit="contain" class="style-pdsc-images" />
                </a>
            </div>
            <div class="text-2xl my-8 text-center md:text-left">About this application</div>

            <div class="flex flex-col md:flex-row my-8 justify-center text-center md:text-left">
                <a href="https://ardc.edu.au/" target="_blank">
                    <el-image
                        :src="images[0]"
                        fit="contain"
                        class="style-pdsc-images my-4 md:my-0"
                    />
                </a>
                <div class="md:mx-6">
                    This work was funded in 2019 by a grant from the ARDC titled
                    <br />"Modularising PARADISEC 's catalogue as a model for the data commons".
                </div>
            </div>

            <p class="my-8">
                This proof of concept is intended to demonstrate a single page application
                operating over an OCFL on-disk repository. In the current configuration, the
                application enables browsing and discovery of the content (collections and items)
                from multiple domains with graceful degradation in the event that the search
                service is unavailable (discovery will be disabled but browsing directly to
                collections and items will continue to work).
            </p>

            <p class="my-8">
                The current status of the application can be seen on the
                <router-link to="/health-check">health-check</router-link>
                &nbsp;page.
                In this demonstrator the URL path is "/{domain}/{collectionId}/{itemId}".
            </p>

            <p class="my-8">
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
        return {
            images: [
                "assets/images/ardc-logo.png",
                "assets/images/coedl-logo.png",
                "assets/images/pdsc-logo.png"
            ]
        };
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

.style-pdsc-images {
    height: 50px;
}
@media (min-width: 768px) {
    .style-pdsc-images {
        height: 80px;
    }
}
</style>