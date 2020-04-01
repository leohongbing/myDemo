/***
 * 随机生成数据
 * @param options {{len: number, deep: number, breadth: number}}
 * @return any[] {Array}
 * */
function generateJsonData(options) {
  var optionC = JSON.parse(JSON.stringify(options))
  let arr = new Array(options.len);
  var obj = {}
  var key, value;
  for (var i = 0; i < arr.length; i++) {
    key = 'child'
    value = returnValue(optionC.deep, optionC.breadth, options)
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
function returnValue(deep, breadth, options) {
  debugger
  var val;
  var arr = []
  // deep = randomNumber(1, deep)
  // breadth = randomNumber(1, breadth)
  if(deep === 1 || deep < 1){
    val = generateId(6)
  }else if(deep > 1){
    for (let j = 0; j < breadth; j++) {
      if(deep === 1){
        deep = options.deep
      }
      var obj = {}
      var key = 'child'
      console.log(deep)
      arr.push(obj)
      obj[key] = returnValue(--deep, --breadth, options)
      obj.hasChild = obj[key] instanceof Object;
      obj.id = generateId(3)
      val = obj
      obj = {}
    }
  }
  console.log(arr)
  return arr;
}

/**
 * 生成指定范围内的随机数
 * */
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}


/**
 * 深克隆
 * */
function deepClone(data) {
  return JSON.parse(JSON.stringify(data))
}

exports.generateJsonData = generateJsonData
