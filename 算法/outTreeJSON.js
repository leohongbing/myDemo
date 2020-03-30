/***
 * 随机生成数据
 * @param options {{len: number, deep: number, breadth: number}}
 * @return any[] {Array}
 * */
function generateJsonData(options) {
  let arr = new Array(options.len);
  var obj = {}
  var key,value;
  for (var i = 0; i < arr.length; i++) {
    key = 'child'
    value = returnValue(options.deep, options.breadth)
    obj[key] = value
    obj.id = generateId(3)
    obj.hasChild = value instanceof Object;
    arr[i] = obj
    obj = {}
  }
  return arr;
}

/**
 * 生成随机key
 * */
function generateId(len) {
  return Math.random().toString(36).substr(3, len);
}

/**
 * 生成随机深度value
 * [ {a: 'a'},{b: 'b'} ]
 * */
function returnValue(deep, breadth) {
  var val;
  deep = randomNumber(1, deep)
  breadth = randomNumber(1, breadth)
  if(deep === 1){
    val = generateId(6)
  }else if(deep > 1){
    var obj = {}
    var key;
    for (var j = 0; j < breadth; j++) {
      key = 'child'
      console.log(deep)
      obj[key] = returnValue(deep, breadth)
      deep--
      obj.hasChild =  obj[key] instanceof Object;
      obj.id = generateId(3)
      val = obj
      obj = {}
    }
  }
  return val;
}

/**
 * 生成指定范围内的随机数
 * */
function randomNumber(min, max) {
  return Math.floor(Math.random()*(max - min + 1)+ min)
}
exports.generateJsonData = generateJsonData
