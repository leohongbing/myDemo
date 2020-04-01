/* deep first search */
let json =  require('./outTreeJSON.js').generateJsonData({ len:2, deep: 2, breadth: 2 });
function DFS(data) {
  debugger
  var queue = []
  for (var i = 0; i < data.length; i++) {
    var el = data[i]
    queue.push(el)

    // 取队列第一个
    if (queue[0]){
      var target = queue.shift(0);
      target.hasChild && queue.push(target.child);
      console.log(target)
    }
  }
}
console.log(json);
DFS(json);

