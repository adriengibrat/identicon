import { seed } from '../seed'
import { hsl2rgb } from './hsl2rgb'

export const light = { hue: 1, saturation: [0.3, 0.7], light: [0.2, 0.5] }
export const dark = { hue: 1, saturation: [0.3, 0.7], light: [0.5, 0.8] }

export const color = (settings) => {
	const hsl = seed(settings)
	return (source: string) =>
	`#${hsl2rgb(hsl(source))
		.map(channel => `0${Math.round(channel * 255).toString(16)}`.substr(-2))
		.join('')}`
}
