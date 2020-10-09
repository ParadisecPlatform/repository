"use strict";

import "assets/tailwind.scss";
import "iv-viewer/dist/iv-viewer.css";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

import ImageViewer from "iv-viewer";
import "element-ui/lib/index.js";
import fontawesome from "@fortawesome/fontawesome-free/js/all";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoReplaceSvg = "nest";
