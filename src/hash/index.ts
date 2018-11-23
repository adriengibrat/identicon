export const hash = fn => (string, init = 0) =>
	Array.from(string).reduce<typeof init>(fn, init)

export { hashcode } from './hashcode'
export { sdbmcode } from './sdbmcode'
