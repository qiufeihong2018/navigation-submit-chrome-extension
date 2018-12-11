import crawler from './crawler'

// 响应 background 信息
chrome.extension.onMessage.addListener(
  function(request, sender, sendMessage) {
    // 获取页面信息
    if (request.action == 'getInfo') {
      const data = {
        ...crawler(),
        type: request.type,
        source: 'd2-awesome-daily-submit-chrome-extension'
      }
      console.log(JSON.stringify(data, null, 4))
      sendMessage()
    }
  }
)
