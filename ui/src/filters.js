"use strict";

import { format, parseISO } from "date-fns";

export function date(value, fmt) {
    if (typeof value === "string") value = parseISO(value);
    if (fmt) {
        return format(value, fmt);
    }
    return format(value, "dd/MM/yyyy");
}

export function toBoolean(string) {
    switch (string.toLowerCase().trim()) {
        case "true":
        case "yes":
        case "1":
            return "True";
        case "false":
        case "no":
        case "0":
        case null:
            return "False";
        default:
            return String(Boolean(string));
    }
}
