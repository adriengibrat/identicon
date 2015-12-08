export default (string = '') => {
	for (var hash = 0, i = 0; i < string.length; i++) {
		hash = string.charCodeAt(i) + (hash << 6) + (hash << 16) - hash
	}

	return hash
}
