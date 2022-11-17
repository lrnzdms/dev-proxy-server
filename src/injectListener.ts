const injectCode = (source:string) => `
    <script>
        (() => new EventSource('${source}').onmessage = () => location.reload())();
    </script>
`;

export const injectListener = (content:string, source:string) => {
	const index = content.indexOf('</body>');
	const start = content.slice(0, index);
	const end = content.slice(index);

	return `${start}${injectCode(source)}${end}`;
};