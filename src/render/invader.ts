const rows = 5

export const invader = (dots: boolean[], color: string, size: number, margin: number) => {
	const dotSize = Math.floor((size - 2 * margin) / rows) - 1
	margin = (size - rows * dotSize) / 2
	const dotId = `dot-${size}-${margin}-${color}`
	const dotsId = `dots-${dots}-${dotId}`
	return `<svg xmlns:xlink="http://www.w3.org/1999/xlink" width="${size}" height="${size}">
	<defs>
		<rect id="${dotId}" width="${dotSize}" height="${dotSize}" transform="translate(${margin},${margin})" fill="${color}" shape-rendering="optimizeSpeed"/>
	</defs>
	<g id="${dotsId}">${dots
		.map(
			(dot, index) =>
				dot
					? `
		<use xlink:href="#${dotId}" x="${Math.floor(index / rows) *
							dotSize}" y="${(index % rows) * dotSize}"/>`
					: '',
		)
		.join('')}
	</g>
	<use xlink:href="#${dotsId}" transform="translate(${size}) scale(-1, 1)"/>
</svg>`
}
