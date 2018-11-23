import { color as _color, light } from './color'
import { hash as _hash, sdbmcode } from './hash'
import * as render from './render'
import { seed } from './seed'

const hash = _hash(sdbmcode)
const color = _color(light)

export const initial = (source: string, { size = 128, margin = 0 } = {}) =>
	render.initial(
		source.split(/[\s\.\-]/, 3).map(x => x.charAt(0).toUpperCase()).join(' '),
		color(source),
		size,
		margin,
	)

export const invader = (source: string, { size = 128, margin = 0 } = {}) =>
	render.invader(
		Array.from(hash(source).toString(2).substr(15), x => x == '1'),
		color(source),
		size,
		margin,
	)

export const slack = (source: string, { size = 128 } = {}) => {
	const { rotate, scale } = seed({ rotate: 360, scale: [1, 1.5] })(source)
	return render.slack(
		rotate,
		scale,
		[color(source), color(source.split('').reverse().join(''))],
		size,
	)
}
