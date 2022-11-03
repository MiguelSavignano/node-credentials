function jsonToDotEnv(json) {
  return Object.entries(json).reduce((memo, [key, value]) => {
    return [...memo, `${key}=${value}`]
  }, []).join('\n')
}
module.exports = { jsonToDotEnv }
