export const sdbmcode = (value: number, character: string) =>
	character.charCodeAt(0) + (value << 6) + (value << 16) - value
