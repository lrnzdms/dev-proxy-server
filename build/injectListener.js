"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectListener = void 0;
const injectCode = (source) => `
    <script>
        (() => new EventSource('${source}').onmessage = () => location.reload())();
    </script>
`;
const injectListener = (content, source) => {
    const index = content.indexOf('</body>');
    const start = content.slice(0, index);
    const end = content.slice(index);
    return `${start}${injectCode(source)}${end}`;
};
exports.injectListener = injectListener;
