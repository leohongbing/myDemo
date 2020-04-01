/**
 * 生成随机id
 * @return {string}
 * */
function RandomId(len) {
  return Math.random().toString(36).substr(3, len);
}

/**
 *
 * @return {string}
 * */
function hr() {
  console.log("--------------------------------------------------------------------")
}
