/* eslint-disable */

// 通过Chrome插件的API加载字体文件
(function insertElementIcons() {
  let elementIcons = document.createElement('style')
  elementIcons.type = 'text/css'
  elementIcons.textContent = `
    @font-face {
      font-family: "element-icons";
      src: url('${ window.chrome.extension.getURL('fonts/element-icons.woff')}') format('woff'),
      url('${ window.chrome.extension.getURL('fonts/element-icons.ttf ')}') format('truetype'); /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
    }
  `
  console.log(elementIcons)
  document.head.appendChild(elementIcons)
})()
