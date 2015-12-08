const mod = 65521

export default (string = '') => {
	for (var a = 1, b = 0, i = 0; i < string.length; i++) {
		a = (a + string.charCodeAt(i)) % mod
		b = (b + a) % mod
	}

	return (b << 16) | a
}
