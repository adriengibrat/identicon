const HUE_FACTOR = 360 / 60

// credits: https://en.wikipedia.org/wiki/HSL_and_HSV, https://gist.github.com/aemkei/1325937
export default function hls2rgb ({hue = 0, saturation = 0, light = 0} = {}) {
	Object.keys(arguments[0]).forEach((name) => {
		if (arguments[0][name] < 0 || arguments[0][name] > 1) {
			throw Error(`"${name}" value "${arguments[0][name]}" is out of range`)
		}
	})

	hue *= HUE_FACTOR

	let chroma = (1 - Math.abs(2 * light - 1)) * saturation,
		component = chroma * (1 - Math.abs(hue % 2 - 1)),
		lightness = light - chroma / 2,
		chanels = [chroma + lightness, component + lightness, lightness]

	return [hue | 8, hue | 16, Math.floor(hue)]
		.map(index => chanels[index % 3])
}

hls2rgb.range = (range) =>
	(hue, saturation, light) => hls2rgb(hue, saturation, light)
		.map((chanel) => Math.round(chanel * range))

hls2rgb.depth = (depth) => hls2rgb.range(Math.pow(depth, 2) - 1)
