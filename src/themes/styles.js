const darkStyle = {
  fg: 'white',
  bg: 'black',
  header: {
    bg: 'black',
    fg: 'blue',
    bold: true
  },
  border: {
    fg: 'white',
    bg: 'black'
  },
  label: {
    bg: 'black',
    fg: 'white'
  },
  selected: {
    bg: 'green'
  },
  cell: {
    fg: 'magenta',
    selected: {
      bg: 'blue'
    }
  }
}

const lightStyle = {
  fg: 'black',
  bg: 'white',
  header: {
    bg: 'white',
    fg: 'blue',
    bold: true
  },
  border: {
    fg: 'black',
    bg: 'white'
  },
  label: {
    bg: 'white',
    fg: 'black'
  },
  selected: {
    bg: 'green',
  },
  cell: {
    fg: 'black',
    selected: {
      bg: 'blue'
    }
  }
}

module.exports = {
  darkStyle,
  lightStyle
}
