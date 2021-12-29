// 这个最后执行
// JS 执行是否被中断，受什么机制影响
console.log('%cJS 执行未被中断, 页面成功渲染', 'background: green;color:#fff;');
document.querySelector('h1').innerHTML = '页面成功渲染';
