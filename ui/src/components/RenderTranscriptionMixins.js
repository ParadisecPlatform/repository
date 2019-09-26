"use strict";

import { round as roundValue, throttle } from "lodash";

export let mixin = {
    props: {
        transcription: {
            type: Object,
            required: true
        },
        currentTime: {
            type: Number
        }
    },
    data() {
        return {
            watchers: {},
            throttleScrollToSegment: throttle(this.scrollToSegment, 1000)
        };
    },
    mounted() {
        this.watchers.currentTime = this.$watch(
            "currentTime",
            this.throttleScrollToSegment
        );
    },
    beforeDestroy() {
        this.watchers.currentTime();
    },
    methods: {
        playSegment(segment) {
            this.$emit("play-from", {
                start: segment.time.begin,
                end: segment.time.end
            });
            setTimeout(() => {
                const container = `#${this.transcription.displayName}`;
                this.$scrollTo(`#${segment.htmlId}`, 300, {
                    container
                });
            }, 100);
        },
        round(value) {
            return roundValue(value, 2);
        },
        scrollToSegment(time) {
            const container = `#${this.transcription.displayName}`;
            const segment = this.transcription.segments
                .filter(segment => segment.time.begin <= time)
                .pop();
            if (!segment) return;
            this.$scrollTo(`#${segment.htmlId}`, 300, {
                container
            });
        }
    }
};
