"use strict";

import { format, parseISO } from "date-fns";
import { isUndefined, isNull } from "lodash";

export function date(date, fmt) {
    if (!date || typeof date === "object") return "";
    if (typeof date === "string") date = parseISO(date);
    if (fmt) {
        return format(date, fmt);
    }
    return format(date, "dd/MM/yyyy");
}

export function toBoolean(s) {
    if (isUndefined(s) || isNull(s) || !["string", "number"].includes(typeof s)) return "";
    if (typeof s === "string") {
        s.toLowerCase().trim();
    }
    switch (s) {
        case "true":
        case "yes":
        case "1":
        case 1:
            return "Yes";
        case "false":
        case "no":
        case "0":
        case 0:
        case null:
            return "No";
        default:
            return s;
    }
}
