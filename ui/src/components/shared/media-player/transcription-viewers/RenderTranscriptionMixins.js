"use strict";

import { flattenDeep, throttle } from "lodash";
import { format } from "date-fns";

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
            highlightSegmentId: undefined,
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
                this.$scrollTo(`#${segment.id}`, 300, {
                    container
                });
            }, 100);
        },
        scrollToSegment(time) {
            const container = `#${this.transcription.displayName}`;
            let segments;
            switch (this.transcription.type) {
                case "ixt":
                    segments = this.transcription.segments.phrases;
                    break;
                case "trs":
                    segments = flattenDeep(
                        this.transcription.segments.episodes.map(e =>
                            e.sections.map(s => s.turns)
                        )
                    );
                    break;
                case "eaf":
                    segments = flattenDeep(
                        this.transcription.timeslots.children.map(
                            t => t.children
                        )
                    );
                    break;
                case "flextext":
                    segments = flattenDeep(
                        this.transcription.segments.paragraphs.map(
                            paragraph => paragraph.phrases
                        )
                    );
                    break;
            }
            const segment = segments
                .filter(segment => {
                    try {
                        return segment.time.begin <= time;
                    } catch (error) {
                        // do nothing
                    }
                })
                .pop();
            if (!segment) return;
            this.highlightSegmentId = segment.id;
            this.$scrollTo(`#${segment.id}`, 300, {
                container
            });
        },
        format(seconds) {
            return format(seconds * 1000, "mm:ss");
        }
    }
};
