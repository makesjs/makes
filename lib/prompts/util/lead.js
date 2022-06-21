const strip = require('./strip');

module.exports = function(str, lead = 0, perLine = process.stdout.columns) {
  if (lead === 0) return str;
  str = strip(str).replace('\r\n', '\n');
  const cap = perLine - lead;
  lead = ' '.repeat(lead);
  if (cap < 5) {
    // too short
    return lead + str;
  }

  let pos = 0;
  const len = str.length;

  function line() {
    if (pos === len) return;
    let output = lead;
    let count = 0;
    let char;
    while (pos < len && (char = str.charAt(pos)) !== '\n') {
      pos += 1;
      // don't add up leading spaces
      if (char === ' ' && count === 0) continue;
      output += char;
      count += 1;
      if (count === cap) break;
    }
    if (count === 0) return;
    return output;
  }

  let l;
  const lines = [];
  while ((l = line()) !== undefined) {
    lines.push(l);
  }

  return lines.join('\n');
};
