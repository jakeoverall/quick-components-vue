interface Number {
  toDate(): Date
  toDateString(): string
  timeAgo(): string
}

Number.prototype.toDate = function () {
  try { return new Date(this) } catch (e) { console.error(new Error("Invalid cast from number to date")) }
}

Number.prototype.toDateString = function () {
  try { return new Date(this).toLocaleDateString() } catch (e) { throw new Error("Invalid cast from number to date string") }
}

Number.prototype.timeAgo = function () {
  try {
    const date = this
    const now = Date.now()
    const times: [string, number][] = [["second", 1], ["minute", 60], ["hour", 3600], ["day", 86400], ["week", 604800], ["month", 2592000], ["year", 31536000]]

    var diff = Math.round((now - date) / 1000)
    for (var t = 0; t < times.length; t++) {
      if (diff < times[t][1]) {
        if (t == 0) {
          return "Just now"
        } else {
          diff = Math.round(diff / times[t - 1][1])
          return diff + " " + times[t - 1][0] + (diff == 1 ? " ago" : "s ago")
        }
      }
    }
    return Math.round(diff / 31536000) + " years ago"
  } catch (e) { console.error(new Error(e)) }
}