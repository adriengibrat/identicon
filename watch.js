#!/usr/bin/env node

var path = require('path'),
	watcher = require('chokidar'),
	build = require('./build'),
	main = process.argv[2],
	dir = path.dirname(main),
	out = process.argv[3]


console.log('watching "%s" dir (main file "%s"), bundle output in "%s"', dir, main, out)

function bundle () {
	build(main, out)
		.then(
			function () { console.log('bundle ready - %s', out); }
			, console.trace.bind(console)
		)
}

watcher
	.watch(dir, {ignored: /[\/\\]\./})
	.on('change', function(path) {
		console.log('change %s file', path)

		bundle()
	})

bundle()
