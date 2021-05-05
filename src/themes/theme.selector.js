const {darkStyle, lightStyle} = require('./styles')
const cli = require('../cli')

const themeStyleMap = {
  light: lightStyle,
  dark: darkStyle
}

const defaultTheme = 'dark'

const isValidTheme = (theme) => themeStyleMap.hasOwnProperty(theme)

module.exports = () => {
  const cliOptions = cli.cliParse()
  const theme = cliOptions.theme && isValidTheme(cliOptions.theme.toLowerCase())
    ? cliOptions.theme.toLowerCase()
    : defaultTheme
  return themeStyleMap[theme]
}
