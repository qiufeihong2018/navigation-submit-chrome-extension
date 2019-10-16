export function isGithub () {
  // eslint-disable-next-line no-useless-escape
  return /^https:\/\/github.com\/[^\/]+\/[^\/]+$/.test(location.href)
}
