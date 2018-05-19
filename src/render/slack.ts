export const slack = (rotate: number, scale: number, colors: string[], size: number) => {
	const width = size / 5
	const round = width / 2
	const barsId = `bars-${size}-${colors}`
	return `<svg xmlns:xlink="http://www.w3.org/1999/xlink" width="${size}" height="${size}">
	<defs>
		<g id="${barsId}">
			<rect width="${size}" height="${width}" rx="${round}" ry="${round}"
				fill="${colors[0]}88" transform="translate(0, ${width})"/>
			<rect width="${width}" height="${size}" rx="${round}" ry="${round}"
				fill="${colors[1]}88" transform="translate(${width})"/>
		</g>
	</defs>
	<g transform="rotate(${rotate}) scale(${scale})" transform-origin="center center">
		<use xlink:href="#${barsId}"/>
		<use xlink:href="#${barsId}" transform="translate(${size}, ${size}) scale(-1, -1)"/>
	</g>
</svg>`
}
