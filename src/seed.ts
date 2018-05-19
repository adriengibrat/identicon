import { hash as _hash, sdbmcode } from './hash'
import { scale as _scale, sinus } from './scale'

export type Shape = {
	[key: string]:
		| number
		| [number, number]
		| [number, number, (x: any) => number]
}
type Seed<S> = { [key in keyof S]: number }

export const seed = <S = Shape>(
	shape: S,
	{ hash = _hash(sdbmcode), scale = _scale(sinus) } = {},
) => (source: string) => {
	const base = hash(source)
	return Object.keys(shape).reduce(
		(generated, key) => {
			const [max, min] = [].concat(shape[key])
			return Object.assign(generated, {
				[key]: scale(hash(key, base), max, min),
			})
		},
		{} as Seed<S>,
	)
}
