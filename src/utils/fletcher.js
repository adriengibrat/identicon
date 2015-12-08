const mod = 255

export default (string = '') => {
	for (var a = 0, b = 0, i = 0; i < string.length; i++) {
		a = (a + string.charCodeAt(i)) % mod
		b = (b + a) % mod
	}

	return (b << 8) | a
}
