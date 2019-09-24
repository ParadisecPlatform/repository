"use strict";

import {
    flatten,
    flattenDeep,
    compact,
    groupBy,
    orderBy,
    map,
    isArray,
    isObject,
    each,
    keys,
    trim
} from "lodash";

export class EAFParser {
    constructor() {}

    parse(data) {
        const timeslots = this.parseTimeSlots(data);
        if (!isArray(data.ANNOTATION_DOCUMENT.TIER)) {
            data.ANNOTATION_DOCUMENT.TIER = [data.ANNOTATION_DOCUMENT.TIER];
        }
        let annotations = this.mapParentAnnotations(data);
        let childAnnotations = this.mapChildAnnotations(data, annotations);
        let annotation, children;

        annotations = annotations.map(a => {
            children = childAnnotations.filter(c => a.id === c.id);
            annotation = Object.assign({}, a);
            each(children, c => {
                annotation.value = Object.assign({}, annotation.value, c.value);
            });
            annotation.value = map(annotation.value, v => v);

            annotation.time.begin = timeslots[annotation.time.begin][0].time;
            annotation.time.end = timeslots[annotation.time.end][0].time;
            return annotation;
        });
        annotations = orderBy(annotations, a => a.time.begin);
        return annotations;
    }

    parseTimeSlots(data) {
        // extract the time slots and group then by id
        const timeslots = map(
            data.ANNOTATION_DOCUMENT.TIME_ORDER.TIME_SLOT,
            function(d) {
                // TIME_VALUE needs to be divided by 1000
                //  to give seconds.milliseconds
                return {
                    id: d["@attributes"].TIME_SLOT_ID,
                    time: parseFloat(d["@attributes"].TIME_VALUE / 1000)
                };
            }
        );
        return groupBy(timeslots, function(d) {
            return d.id;
        });
    }

    mapParentAnnotations(data) {
        let annotation, annotationData;
        let annotations = [];
        each(data.ANNOTATION_DOCUMENT.TIER, tier => {
            try {
                if (!tier["@attributes"].PARENT_REF) {
                    annotations = [
                        ...annotations,
                        flattenDeep(processParentTier(tier))
                    ];
                    // } else {
                    //   processChildTier(tier, annotations);
                }
            } catch (e) {
                console.log(JSON.stringify(tier, null, 2));
            }
        });
        return flattenDeep(annotations);

        function processParentTier(tier) {
            if (isObject(tier.ANNOTATION)) {
                tier.ANNOTATION = [tier.ANNOTATION];
            }
            tier.ANNOTATION = flattenDeep(tier.ANNOTATION);
            return tier.ANNOTATION.map(a => {
                annotation = a.ALIGNABLE_ANNOTATION;
                annotationData = {
                    id: annotation["@attributes"].ANNOTATION_ID,
                    tierId: tier["@attributes"].TIER_ID,
                    time: {
                        begin: annotation["@attributes"].TIME_SLOT_REF1,
                        end: annotation["@attributes"].TIME_SLOT_REF2
                    },
                    value: {
                        [tier["@attributes"].TIER_ID]: {
                            language: tier["@attributes"].DEFAULT_LOCALE,
                            text: trim(annotation.ANNOTATION_VALUE["#text"])
                        }
                    }
                };
                return annotationData;
            });
        }
    }

    mapChildAnnotations(data, annotations) {
        let childAnnotations = [];
        each(data.ANNOTATION_DOCUMENT.TIER, tier => {
            try {
                if (tier["@attributes"].PARENT_REF) {
                    childAnnotations = [
                        ...childAnnotations,
                        flattenDeep(processChildTier(tier))
                    ];
                }
            } catch (e) {
                console.log(JSON.stringify(tier, null, 2));
            }
        });
        return flattenDeep(childAnnotations);

        function processChildTier(tier) {
            let annotation;
            if (isObject(tier.ANNOTATION)) {
                tier.ANNOTATION = [tier.ANNOTATION];
            }
            tier.ANNOTATION = flattenDeep(tier.ANNOTATION);
            const annotations = tier.ANNOTATION.map(a => {
                annotation = a.REF_ANNOTATION;
                return {
                    id: annotation["@attributes"].ANNOTATION_REF,
                    value: {
                        [tier["@attributes"].TIER_ID]: {
                            language: tier["@attributes"].DEFAULT_LOCALE,
                            text: trim(annotation.ANNOTATION_VALUE["#text"])
                        }
                    }
                };
            });
            return annotations;
        }
    }
}
