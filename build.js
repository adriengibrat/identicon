#!/usr/bin/env node

var bundler = require('rollup'),
	transpiler = require('rollup-plugin-babel'),
	npm = require('rollup-plugin-npm'),
	commonjs = require('rollup-plugin-commonjs')

function build(main, out) {
	return bundler
		.rollup({
			entry: main
			, plugins: [
				transpiler({ presets: ['es2015-rollup'] }),
				npm({ jsnext: true, main: true }),
				commonjs()
			]
		})
		.then(function(bundle) {
			return bundle
				.write({
					format: 'umd',
					moduleName: 'identicon',
					dest: out
				})
		})
}

module.exports = build

build(process.argv[2], process.argv[3])
