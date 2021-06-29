"use strict";

// import { SearchService } from "../search.service";

// export let mixin = {
//     components: {},
//     props: {
//         id: {
//             type: Number,
//             required: true
//         },
//         field: {
//             type: Object,
//             required: true
//         }
//     },
//     beforeMount() {
//         this.ss = new SearchService({ store: this.$store });
//         this.restoreState();
//     },
//     methods: {
//         saveState() {
//             const savedSearch = JSON.parse(sessionStorage.getItem(this.id));
//             savedSearch.value = this.value;
//             sessionStorage.setItem(this.id, JSON.stringify(savedSearch));
//         },
//         restoreState() {
//             const savedSearch = JSON.parse(sessionStorage.getItem(this.id));
//             if (savedSearch) {
//                 this.value = savedSearch.value;
//                 this.emitSelection();
//             }
//         }
//     }
// };

