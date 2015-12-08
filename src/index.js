//import hash from './utils/hashcode'
import hash from './utils/adler32'
//import hash from './utils/fletcher'
//import hash from './utils/sdbmcode'
import hsl2rgb from './utils/hsl2rgb'
import github from './render/github'

export default function identicon ({color = identicon.color, render = identicon.render, size, margin} = {}) {

	return (string) => render(Math.abs(hash(string) - 1), color(string), size, margin)
}

identicon.color = (string) => hsl2rgb(Math.abs(hash(string.replace(/^[^@]+@/, '')) / 0xfffffff))

identicon.render = github
