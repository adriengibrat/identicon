export const hashcode = (value, character) =>
	((value << 5) - value + character.charCodeAt(0)) >> 0
