export const initial = (text: string, color: string, size: number, margin: number) => {
	const center = size / 2
	return `<svg height="${size}" width="${size}">
	<rect height="${size}" width="${size}" fill="${color}"/>
	<text x="${center}" y="${center}" fill="#fff" font-family="Arial" font-size="${Math.round((size - 2 * margin) / 3)}" text-anchor="middle" alignment-baseline="central">${text}</text>
</svg>`
}
