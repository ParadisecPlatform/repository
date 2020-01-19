"use strict";

import { format, parseISO } from "date-fns";

export function date(value, fmt) {
    if (typeof value === "string") value = parseISO(value);
    if (fmt) {
        return format(value, fmt);
    }
    return format(value, "dd/MM/yyyy");
}
