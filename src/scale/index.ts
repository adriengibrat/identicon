export { cosinus } from './cosinus'
export { sinus } from './sinus'

export const scale = ({ fn, max, min }) => (n, rangemax, rangemin = 0) =>
	(fn(n) - min) / (max - min) * (rangemax - rangemin) + rangemin
