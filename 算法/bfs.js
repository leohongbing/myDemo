/* Breadth First Search */
let json =  require('./outTreeJSON.js').generateJsonData({ len:10, deep: 2, breadth: 2 });
function BFS(json) {
  console.log(json)
  json = JSON.parse(JSON.stringify(json))
  let queue = [...json]
  for (var i = 0; i < queue.length; i++) {
    var item = queue[i]
    if(item.hasChild){
      queue.push(item.child)
    }
    console.log(item.id)
  }
}
BFS(json)
