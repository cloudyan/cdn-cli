exports.fail = function fail(...rest) {
  console.warn(...rest);
}
exports.success = function success(...rest) {
  console.log(...rest);
}
exports.info = function info(...rest) {
  console.log(...rest);
}
