import strip from './strip';

export default function(str, lead = 0, perLine = process.stdout.columns) {
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
      output += char;
      pos += 1;
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
}
