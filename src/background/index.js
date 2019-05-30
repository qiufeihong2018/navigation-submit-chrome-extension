/* eslint-disable */

const menus = [
  '新闻',
  '开源项目',
  '分享',
  '教程',
  '网站',
  '工具',
  '设计',
  '招聘'
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
