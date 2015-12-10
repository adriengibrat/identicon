/* global Number: true, Error: true, Math: true, parseInt: true */

import PNGlib from 'pnglib'

function square (size, color, x, y) {
	for (var right = x + size; x < right; x++) {
		for (var top = y, bottom = top + size; top < bottom; top++) {
			this.buffer[this.index(x, top)] = color
		}
	}
}

const columns = 5

export default (hash, rgb, size = 64, margin = 7) => {
	let cell = (size - margin * 2) / columns
	if (!Number.isInteger(cell)) {
		throw new Error('size and margin are not valid')
	}

	let png = new PNGlib(size, size, 256),
		bg = png.color.apply(png, [255, 255, 255, 0]),
		color = png.color.apply(png, rgb.map((c) => Math.round(c * 255))),
		draw = (x, y) => square.call(png, cell, color, x + margin, y + margin)

	hash = hash.toString(2)

	for (var i = 0, l = columns * Math.ceil(columns / 2); i < l; i++) {
		if (!parseInt(hash.charAt(i), 10)) {
			continue
		}

		if (i < columns) {
			draw(2 * cell, i * cell)
		} else if (i < (2 * columns)) {
			draw(cell, (i - columns) * cell)
			draw(3 * cell, (i - columns) * cell)
		} else if (i < (3 * columns)) {
			draw(0, (i - (2 * columns)) * cell)
			draw(4 * cell, (i - (2 * columns)) * cell)
		}
	}

	// convert PNG to string
	// return "\x89PNG\r\n\x1a\n"+this.buffer.join('');

	try {
		var string = png.getDump()
		var bytes = new Uint8Array(string.length)
		for (var i = 0; i < string.length; i++)
			bytes[i] = string.charCodeAt(i)

		return URL.createObjectURL(new Blob([bytes], {type: 'image/png'}))
	} catch (e) {
		return `data:image/png;base64,${png.getBase64()}`
	}

}
