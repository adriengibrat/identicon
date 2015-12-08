export default (hue, saturation = .5, light = .7) => {
	hue *= 6
	let chanel = [
		light += saturation *= light < .5 ? light : 1 - light,
		light - hue % 1 * saturation * 2,
		light -= saturation *= 2,
		light,
		light + hue % 1 * saturation,
		light + saturation
	]

	return [~~hue, hue | 16, hue | 8].map(x => chanel[x % chanel.length])
}
