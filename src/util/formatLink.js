const formatLink = (link) => {
  if (link.indexOf('http://') === -1 && link.indexOf('https://') === -1) {
    return `http://${link}`
  }
  return link
}

export default formatLink
