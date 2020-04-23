let a = {b:{c:{d:'hp'}}}
const recast = require('recast')
const code1 = `a.b.c.d`
const code2 = `a[b][c][d]`

const ast1 = recast.parse(code1)
const ast2 = recast.parse(code2)

console.log(recast)
