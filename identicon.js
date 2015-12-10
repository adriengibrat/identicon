(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.identicon = factory();
}(this, function () { 'use strict';

    var pnglib = (function (module) {
    var exports = module.exports;
    /**
     * A handy class to calculate color values.
     *
     * @version 1.0
     * @author Robert Eisele <robert@xarg.org>
     * @copyright Copyright (c) 2010, Robert Eisele
     * @link http://www.xarg.org/2010/03/generate-client-side-png-files-using-javascript/
     * @license http://www.opensource.org/licenses/bsd-license.php BSD License
     *
     */

    // Modified by George Chan <gchan@21cn.com>

    module.exports = function (width, height, depth) {

        // helper functions for that ctx
        function write(buffer, offs) {
            for (var i = 2; i < arguments.length; i++) {
                for (var j = 0; j < arguments[i].length; j++) {
                    buffer[offs++] = arguments[i].charAt(j);
                }
            }
        }

        function byte2(w) {
            return String.fromCharCode(w >> 8 & 255, w & 255);
        }

        function byte4(w) {
            return String.fromCharCode(w >> 24 & 255, w >> 16 & 255, w >> 8 & 255, w & 255);
        }

        function byte2lsb(w) {
            return String.fromCharCode(w & 255, w >> 8 & 255);
        }

        this.width = width;
        this.height = height;
        this.depth = depth;

        // pixel data and row filter identifier size
        this.pix_size = height * (width + 1);

        // deflate header, pix_size, block headers, adler32 checksum
        this.data_size = 2 + this.pix_size + 5 * Math.floor((0xfffe + this.pix_size) / 0xffff) + 4;

        // offsets and sizes of Png chunks
        this.ihdr_offs = 0; // IHDR offset and size
        this.ihdr_size = 4 + 4 + 13 + 4;
        this.plte_offs = this.ihdr_offs + this.ihdr_size; // PLTE offset and size
        this.plte_size = 4 + 4 + 3 * depth + 4;
        this.trns_offs = this.plte_offs + this.plte_size; // tRNS offset and size
        this.trns_size = 4 + 4 + depth + 4;
        this.idat_offs = this.trns_offs + this.trns_size; // IDAT offset and size
        this.idat_size = 4 + 4 + this.data_size + 4;
        this.iend_offs = this.idat_offs + this.idat_size; // IEND offset and size
        this.iend_size = 4 + 4 + 4;
        this.buffer_size = this.iend_offs + this.iend_size; // total PNG size

        this.buffer = new Array();
        this.palette = new Object();
        this.pindex = 0;

        var _crc32 = new Array();

        // initialize buffer with zero bytes
        for (var i = 0; i < this.buffer_size; i++) {
            this.buffer[i] = "\x00";
        }

        // initialize non-zero elements
        write(this.buffer, this.ihdr_offs, byte4(this.ihdr_size - 12), 'IHDR', byte4(width), byte4(height), "\x08\x03");
        write(this.buffer, this.plte_offs, byte4(this.plte_size - 12), 'PLTE');
        write(this.buffer, this.trns_offs, byte4(this.trns_size - 12), 'tRNS');
        write(this.buffer, this.idat_offs, byte4(this.idat_size - 12), 'IDAT');
        write(this.buffer, this.iend_offs, byte4(this.iend_size - 12), 'IEND');

        // initialize deflate header
        var header = 8 + (7 << 4) << 8 | 3 << 6;
        header += 31 - header % 31;

        write(this.buffer, this.idat_offs + 8, byte2(header));

        // initialize deflate block headers
        for (var i = 0; (i << 16) - 1 < this.pix_size; i++) {
            var size, bits;
            if (i + 0xffff < this.pix_size) {
                size = 0xffff;
                bits = "\x00";
            } else {
                size = this.pix_size - (i << 16) - i;
                bits = "\x01";
            }
            write(this.buffer, this.idat_offs + 8 + 2 + (i << 16) + (i << 2), bits, byte2lsb(size), byte2lsb(~size));
        }

        /* Create crc32 lookup table */
        for (var i = 0; i < 256; i++) {
            var c = i;
            for (var j = 0; j < 8; j++) {
                if (c & 1) {
                    c = -306674912 ^ c >> 1 & 0x7fffffff;
                } else {
                    c = c >> 1 & 0x7fffffff;
                }
            }
            _crc32[i] = c;
        }

        // compute the index into a png for a given pixel
        this.index = function (x, y) {
            var i = y * (this.width + 1) + x + 1;
            var j = this.idat_offs + 8 + 2 + 5 * Math.floor(i / 0xffff + 1) + i;
            return j;
        };

        // convert a color and build up the palette
        this.color = function (red, green, blue, alpha) {

            alpha = alpha >= 0 ? alpha : 255;
            var color = ((alpha << 8 | red) << 8 | green) << 8 | blue;

            if (typeof this.palette[color] == "undefined") {
                if (this.pindex == this.depth) return "\x00";

                var ndx = this.plte_offs + 8 + 3 * this.pindex;

                this.buffer[ndx + 0] = String.fromCharCode(red);
                this.buffer[ndx + 1] = String.fromCharCode(green);
                this.buffer[ndx + 2] = String.fromCharCode(blue);
                this.buffer[this.trns_offs + 8 + this.pindex] = String.fromCharCode(alpha);

                this.palette[color] = String.fromCharCode(this.pindex++);
            }
            return this.palette[color];
        };

        // output a PNG string, Base64 encoded
        this.getBase64 = function () {

            var s = this.getDump();

            var ch = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var c1, c2, c3, e1, e2, e3, e4;
            var l = s.length;
            var i = 0;
            var r = "";

            do {
                c1 = s.charCodeAt(i);
                e1 = c1 >> 2;
                c2 = s.charCodeAt(i + 1);
                e2 = (c1 & 3) << 4 | c2 >> 4;
                c3 = s.charCodeAt(i + 2);
                if (l < i + 2) {
                    e3 = 64;
                } else {
                    e3 = (c2 & 0xf) << 2 | c3 >> 6;
                }
                if (l < i + 3) {
                    e4 = 64;
                } else {
                    e4 = c3 & 0x3f;
                }
                r += ch.charAt(e1) + ch.charAt(e2) + ch.charAt(e3) + ch.charAt(e4);
            } while ((i += 3) < l);
            return r;
        };

        // output a PNG string
        this.getDump = function () {

            // compute adler32 of output pixels + row filter bytes
            var BASE = 65521; /* largest prime smaller than 65536 */
            var NMAX = 5552; /* NMAX is the largest n such that 255n(n+1)/2 + (n+1)(BASE-1) <= 2^32-1 */
            var s1 = 1;
            var s2 = 0;
            var n = NMAX;

            for (var y = 0; y < this.height; y++) {
                for (var x = -1; x < this.width; x++) {
                    s1 += this.buffer[this.index(x, y)].charCodeAt(0);
                    s2 += s1;
                    if ((n -= 1) == 0) {
                        s1 %= BASE;
                        s2 %= BASE;
                        n = NMAX;
                    }
                }
            }
            s1 %= BASE;
            s2 %= BASE;
            write(this.buffer, this.idat_offs + this.idat_size - 8, byte4(s2 << 16 | s1));

            // compute crc32 of the PNG chunks
            function crc32(png, offs, size) {
                var crc = -1;
                for (var i = 4; i < size - 4; i += 1) {
                    crc = _crc32[(crc ^ png[offs + i].charCodeAt(0)) & 0xff] ^ crc >> 8 & 0x00ffffff;
                }
                write(png, offs + size - 4, byte4(crc ^ -1));
            }

            crc32(this.buffer, this.ihdr_offs, this.ihdr_size);
            crc32(this.buffer, this.plte_offs, this.plte_size);
            crc32(this.buffer, this.trns_offs, this.trns_size);
            crc32(this.buffer, this.idat_offs, this.idat_size);
            crc32(this.buffer, this.iend_offs, this.iend_size);

            // convert PNG to string
            return "\x89PNG\r\n\x1a\n" + this.buffer.join('');
        };
    };
    return module.exports;
    })({exports:{}});

    function square(size, color, x, y) {
    	for (var right = x + size; x < right; x++) {
    		for (var top = y, bottom = top + size; top < bottom; top++) {
    			this.buffer[this.index(x, top)] = color;
    		}
    	}
    }

    var columns = 5;

    var github = (function (hash, rgb) {
    	var size = arguments.length <= 2 || arguments[2] === undefined ? 64 : arguments[2];
    	var margin = arguments.length <= 3 || arguments[3] === undefined ? 7 : arguments[3];

    	var cell = (size - margin * 2) / columns;
    	if (!Number.isInteger(cell)) {
    		throw new Error('size and margin are not valid');
    	}

    	var png = new pnglib(size, size, 256),
    	    bg = png.color.apply(png, [255, 255, 255, 0]),
    	    color = png.color.apply(png, rgb.map(function (c) {
    		return Math.round(c * 255);
    	})),
    	    draw = function draw(x, y) {
    		return square.call(png, cell, color, x + margin, y + margin);
    	};

    	hash = hash.toString(2);

    	for (var i = 0, l = columns * Math.ceil(columns / 2); i < l; i++) {
    		if (!parseInt(hash.charAt(i), 10)) {
    			continue;
    		}

    		if (i < columns) {
    			draw(2 * cell, i * cell);
    		} else if (i < 2 * columns) {
    			draw(cell, (i - columns) * cell);
    			draw(3 * cell, (i - columns) * cell);
    		} else if (i < 3 * columns) {
    			draw(0, (i - 2 * columns) * cell);
    			draw(4 * cell, (i - 2 * columns) * cell);
    		}
    	}

    	// convert PNG to string
    	// return "\x89PNG\r\n\x1a\n"+this.buffer.join('');

    	try {
    		var string = png.getDump();
    		var bytes = new Uint8Array(string.length);
    		for (var i = 0; i < string.length; i++) {
    			bytes[i] = string.charCodeAt(i);
    		}return URL.createObjectURL(new Blob([bytes], { type: 'image/png' }));
    	} catch (e) {
    		return 'data:image/png;base64,' + png.getBase64();
    	}
    })

    var mod = 65521;

    var hash = (function () {
    	var string = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

    	for (var a = 1, b = 0, i = 0; i < string.length; i++) {
    		a = (a + string.charCodeAt(i)) % mod;
    		b = (b + a) % mod;
    	}

    	return b << 16 | a;
    })

    var HUE_FACTOR = 360 / 60;

    // credits: https://en.wikipedia.org/wiki/HSL_and_HSV, https://gist.github.com/aemkei/1325937
    function hls2rgb(hue) {
    	var saturation = arguments.length <= 1 || arguments[1] === undefined ? .5 : arguments[1];
    	var light = arguments.length <= 2 || arguments[2] === undefined ? .7 : arguments[2];

    	hue *= HUE_FACTOR;

    	var chroma = (1 - Math.abs(2 * light - 1)) * saturation,
    	    component = chroma * (1 - Math.abs(hue % 2 - 1)),
    	    lightness = light - chroma / 2,
    	    chanels = [chroma + lightness, component + lightness, lightness];

    	return [hue | 8, hue | 16, Math.floor(hue)].map(function (index) {
    		return chanels[index % 3];
    	});
    }

    hls2rgb.range = function (range) {
    	return function (hue, saturation, light) {
    		return hls2rgb(hue, saturation, light).map(function (chanel) {
    			return Math.round(chanel * range);
    		});
    	};
    };

    hls2rgb.depth = function (depth) {
    	return hls2rgb.range(Math.pow(depth, 2) - 1);
    };

    function identicon() {
    	var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    	var _ref$color = _ref.color;
    	var color = _ref$color === undefined ? identicon.color : _ref$color;
    	var _ref$render = _ref.render;
    	var render = _ref$render === undefined ? identicon.render : _ref$render;
    	var size = _ref.size;
    	var margin = _ref.margin;

    	return function (string) {
    		return render(Math.abs(hash(string) - 1), color(string), size, margin);
    	};
    }

    identicon.color = function (string) {
    	return hls2rgb(Math.abs(hash(string.replace(/^[^@]+@/, '')) / 0xfffffff));
    };

    identicon.render = github;

    return identicon;

}));