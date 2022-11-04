<template>
    <div class="mt-4">
        <div ref="map" class="z-0" :style="{ width: `${width}px`, height: `${height}px` }"></div>
    </div>
</template>

<script>
import leaflet from "leaflet";

export default {
    props: {
        box: {
            type: String,
        },
        colour: {
            type: String,
            default: "red",
        },
        width: {
            type: String,
            default: "300",
        },
        height: {
            type: String,
            default: "300",
        },
    },
    data() {
        return {
            map: undefined,
        };
    },
    mounted() {
        this.map = leaflet.map(this.$refs.map).setView([0, 0], 0);
        L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
            {
                // attribution:
                //     "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
            }
        ).addTo(this.map);
        if (this.box) {
            let bottomLeft = JSON.parse(`[${this.box.split(" ")[0]}]`);
            let topRight = JSON.parse(`[${this.box.split(" ")[1]}]`);
            const rectangle = L.rectangle([bottomLeft.reverse(), topRight.reverse()], {
                color: this.colour,
            }).addTo(this.map);
            this.map.fitBounds(rectangle.getBounds());
        }
        this.map.zoomOut();
        // L.tileLayer(
        //     "https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}",
        //     {
        //         attribution:
        //             'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        //         subdomains: "abcd",
        //         minZoom: 1,
        //         maxZoom: 16,
        //         ext: "jpg"
        //     }
        // ).addTo(this.map);
    },
    methods: {},
};
</script>

<style lang="scss" scoped></style>
