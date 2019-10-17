/* eslint-disable */
// 爬虫
import $ from 'jquery'
import {
  isGithub
} from './is'

export default function () {
  // 网站名称
  let name = document.title
  // 网站描述
  let describe = document.title
  // console.log('name', name)
  // 如果是 github 开源仓库 获取 github 的数据
  let githubInfo = {
    lang: '',
    langPrimary: '',
    watch: null,
    star: null,
    fork: null
  }
  // 分割题目和描述
  function split(data, s = ': ') {
    const arr = data.split(s)
    const [first, ...second] = arr
    return [
      first,
      second.join(s)
    ]
  }

  // 如果是 github 项目地址，检查语言类型
  function getGithubInfo() {

    if (isGithub()) {
      const doms = $('.pagehead-actions').eq(0).children()
      // 语言
      const lang = $('.repository-lang-stats-graph.js-toggle-lang-stats').text().split('\n').map(e => e.trim()).filter(e => e !== '')
      githubInfo.lang = lang.length > 0 ? lang.join(',') : 'other'
      githubInfo.langPrimary = lang.length > 0 ? lang[0] : 'other'
      // watch
      githubInfo.watch = doms.eq(doms.length - 3).find('a.social-count').html().trim().replace(',', '')
      // star
      githubInfo.star = doms.eq(doms.length - 2).find('a.social-count').html().trim().replace(',', '')
      // fork
      githubInfo.fork = doms.eq(doms.length - 1).find('a.social-count').html().trim().replace(',', '')
    }
  }


  switch (document.location.host) {
    case 'github.com': {
      name = split(document.title)[0]
      describe = split(document.title)[1]
      getGithubInfo()
      // 返回数据
      return {
        name,
        describe,
        website: document.location.href,
        ...githubInfo
      }
    };
  case 'juejin.im': {
    name = split(document.title, ' - ')[0]
    describe = split(document.title, ' - ')[1]
  };
  break;
  case 'mp.weixin.qq.com': {
    name = document.querySelector('#activity-name').innerText
  };
  break;
  case 'uimovement.com': {
    name = split(document.title, ' - ')[0]
    describe = split(document.title, ' - ')[1]
  };
  break;
  default:
    break;
  }

  // 返回数据
  return {
    name,
    describe,
    website: document.location.href
  }
}
