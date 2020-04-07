function parseBody (body) {
  const bodyArray = body.split('&')

  const bodyObject = bodyArray.reduce(
    (accumulator, currentValue) => {
      const [key, value] = currentValue.split('=')

      accumulator[key] = value

      return accumulator
    }, {}
  )
  return bodyObject
}

module.exports = {
  parseBody
}