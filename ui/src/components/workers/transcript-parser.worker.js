import { Parser } from "transcription-parsers";

self.addEventListener("message", m => {
    let parser = new Parser({
        name: m.data.name,
        data: m.data.xmlString
    });
    parser.parse().then(result => {
        self.postMessage(result);
    });
});
