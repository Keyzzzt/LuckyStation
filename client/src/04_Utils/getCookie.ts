export const getCookie = function (name: string) {
  var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  if (match) return match[2]
}
