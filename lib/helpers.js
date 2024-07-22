function formatNumber(number, prefix = null, defaultValue = 0) {
  // change number format it's number greater than 0
  if (number > 0) {
    const format = parseInt(number)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    if (prefix) {
      return `${prefix} ${format}`
    }
    return format
  } else {
    return defaultValue
  }
}

export { formatNumber }
