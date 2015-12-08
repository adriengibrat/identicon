export default (string = '') => {
	for (var hash = 0, i = 0; i < string.length; i++) {
		hash = (((hash << 5) - hash) + string.charCodeAt(i)) >> 0 // bitwise to convert to int32
	}

	return hash
}
