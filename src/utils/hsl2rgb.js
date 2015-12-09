/*
export default function hls2rgb (hue, saturation = .5, light = .7) {
	hue *= 6
	let chanels = [
		light += saturation *= light < .5 ? light : 1 - light,
		light - hue % 1 * saturation * 2,
		light -= saturation *= 2,
		light,
		light + hue % 1 * saturation,
		light + saturation
	]

	return [~~hue, hue | 16, hue | 8].map(x => chanels[x % chanels.length])
}
*/
const HUE_FACTOR = 360 / 60

// credits: https://en.wikipedia.org/wiki/HSL_and_HSV, https://gist.github.com/aemkei/1325937
export default function hls2rgb (hue, saturation = .5, light = .7) {
	hue *= HUE_FACTOR
	let chroma = (1 - Math.abs(2 * light - 1)) * saturation,
		component = chroma * (1 - Math.abs(hue % 2 - 1)),
		lightness = light - chroma / 2,
		chanels = [chroma + lightness, component + lightness, lightness],
		length = channels.length

	//return [hue | 8, hue | 16, Math.floor(hue)].map(index => chanels[index % chanels.length])
	return [chanels[(hue | 8) % length], chanels[(hue | 16) % length], chanels[Math.floor(hue) % length]]
}

hls2rgb.range = (range) => function (/*hue, saturation, light*/) {
	//return hls2rgb(hue, saturation, light).map((chanel) => Math.round(chanel * range))
	let [red, green, blue] = hls2rgb.apply(null, arguments)
	return [Math.round(red * range), Math.round(green * range), Math.round(blue * range)]
}

hls2rgb.depth = (depth) => hls2rgb.range(Math.pow(depth, 2) - 1)
