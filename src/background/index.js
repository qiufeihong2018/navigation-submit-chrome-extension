/* eslint-disable */

const menus = [
  '推荐到Navigation'
]

menus.forEach((menu, index) => {
  chrome.contextMenus.create({
    title: menu,
    onclick: function (info, tab) {
      chrome.tabs.sendMessage(tab.id, {
        action: 'getInfo',
        category: menu
      })
    }
  })
})
