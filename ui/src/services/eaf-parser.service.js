"use strict";

import convert from "xml-js";
import {
    flattenDeep,
    groupBy,
    orderBy,
    map,
    isArray,
    isObject,
    each,
    trim,
    uniq
} from "lodash";

export class SimpleEAFParser {
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

export class EAFParser {
    constructor() {}

    async extract({ data }) {
        // let data = await readfile(path.join(this.folder, this.file), "utf-8");
        this.data = convert.xml2js(data);

        let annotations = [];
        let tiers = [];
        let timeslots = this.extractTimeSlots();
        let errors = [];
        if (timeslots.length) {
            let {
                alignableAnnotations,
                referenceAnnotations
            } = this.extractAnnotations();
            tiers = [
                ...alignableAnnotations.map(a => a.tier),
                ...referenceAnnotations.map(r => r.tier)
            ];
            tiers = uniq(tiers);

            annotations = this.joinAnnotations({
                alignableAnnotations: [...alignableAnnotations],
                referenceAnnotations: [...referenceAnnotations]
            });
            let timeslotsKeyedByName = groupBy(timeslots, "name");
            annotations = annotations.map(a => {
                a.htmlId = a.name;
                a.time = {
                    begin: timeslotsKeyedByName[a.ts.start][0].value / 1000,
                    end: timeslotsKeyedByName[a.ts.end][0].value / 1000
                };
                return a;
            });
            // tiers = this.joinAnnotationsToTiers({
            //     alignableAnnotations,
            //     referenceAnnotations
            // });
            // console.log(tiers);
            // timeslots = this.joinAnnotationsToTimeslots({
            //     annotations,
            //     timeslots
            // });
            // console.log(timeslots);
        } else {
            errors.push({ msg: "No timeslots found" });
        }

        return { segments: annotations, tiers };
    }

    extractTimeSlots() {
        let timeslots = this.data.elements[0].elements.filter(
            e => e.name === "TIME_ORDER"
        );

        if (timeslots.length) {
            timeslots = timeslots[0].elements;
            timeslots = timeslots.map(timeslot => {
                return {
                    name: timeslot.attributes.TIME_SLOT_ID,
                    value: parseInt(timeslot.attributes.TIME_VALUE)
                };
            });
        }

        return timeslots;
    }

    extractAnnotations() {
        let annotations = this.data.elements[0].elements
            .filter(e => e.name === "TIER")
            .map(t => {
                return t.elements.map(a => {
                    return { ...a, tier: t.attributes.TIER_ID };
                });
            });

        annotations = flattenDeep(annotations);
        let alignableAnnotations = annotations.filter(a => {
            return a.elements[0].name === "ALIGNABLE_ANNOTATION";
        });
        let referenceAnnotations = annotations.filter(a => {
            return a.elements[0].name === "REF_ANNOTATION";
        });

        alignableAnnotations = alignableAnnotations.map(annotation => {
            try {
                return {
                    name: annotation.elements[0].attributes.ANNOTATION_ID,
                    type: "ALIGNABLE_ANNOTATION",
                    value: annotation.elements[0].elements[0].elements
                        ? annotation.elements[0].elements[0].elements[0].text
                        : undefined,
                    tier: annotation.tier,
                    children: [],
                    ts: {
                        start: annotation.elements[0].attributes.TIME_SLOT_REF1,
                        end: annotation.elements[0].attributes.TIME_SLOT_REF2
                    }
                };
            } catch (error) {
                console.log(JSON.stringify(annotation, null, 2));
            }
        });

        referenceAnnotations = referenceAnnotations.map(annotation => {
            return {
                name: annotation.elements[0].attributes.ANNOTATION_ID,
                parent: annotation.elements[0].attributes.ANNOTATION_REF,
                type: "REF_ANNOTATION",
                value: annotation.elements[0].elements[0].elements
                    ? annotation.elements[0].elements[0].elements[0].text
                    : undefined,
                tier: annotation.tier,
                children: []
            };
        });

        return {
            alignableAnnotations: alignableAnnotations,
            referenceAnnotations: referenceAnnotations
        };
    }

    joinAnnotations({ alignableAnnotations, referenceAnnotations }) {
        referenceAnnotations.forEach(annotation => {
            join(annotation, alignableAnnotations);
        });
        return alignableAnnotations;

        function join(annotation, annotations) {
            for (let a of annotations) {
                if (annotation.parent === a.name) {
                    a.children.push(annotation);
                    break;
                } else {
                    join(annotation, a.children);
                }
            }
        }
    }

    joinAnnotationsToTimeslots({ annotations, timeslots }) {
        for (let annotation of annotations) {
            for (let timeslot of timeslots) {
                if (annotation.ts.start === timeslot.name)
                    timeslot.children = [{ ...annotation }];
                if (annotation.ts.end === timeslot.name)
                    timeslot.children = [{ ...annotation }];
            }
        }
        return timeslots;
    }

    joinAnnotationsToTiers({ alignableAnnotations, referenceAnnotations }) {
        let groupedByTier = groupBy(
            [...alignableAnnotations, ...referenceAnnotations],
            "tier"
        );
        let tiers = [];
        for (let tier of Object.keys(groupedByTier)) {
            tiers.push({
                name: tier,
                value: "",
                children: groupedByTier[tier]
            });
        }
        return tiers;
    }
}
