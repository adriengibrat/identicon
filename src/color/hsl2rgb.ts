const HUE_FACTOR = 360 / 60
// credits:
// https://en.wikipedia.org/wiki/HSL_and_HSV
// https://gist.github.com/aemkei/1325937
export const hsl2rgb = ({ hue = 0, saturation = 0, light = 0 }) => {
	const hsl = { hue, saturation, light }
	Object.keys(hsl).forEach(key => {
		if (hsl[key] < 0 || hsl[key] > 1)
			throw RangeError(`"${key}" value "${hsl[key]}" is out of range`)
	})
	hue *= HUE_FACTOR
	const chroma = (1 - Math.abs(2 * light - 1)) * saturation
	const component = chroma * (1 - Math.abs(hue % 2 - 1))
	const lightness = light - chroma / 2
	const chanels = [chroma + lightness, component + lightness, lightness]
	return [hue | 8, hue | 16, Math.floor(hue)].map(index => chanels[index % 3])
}
