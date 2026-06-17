// Test parser for scorers
function parseScorers(s) {
  if (!s || s === 'null') return [];
  const result = [];
  // Match: "Name MM'" or "Name MM+NN'" or "Name 90'+5'" or "Name 90+5' (p)"
  // Minute formats: 66, 45+2, 90+6, 90'+5'
  const regex = /"([^"']+?)\s+(\d+(?:'\+)?\+?\d*)'(?:\s*\(([^)]+)\))?"/g;
  let match;
  while ((match = regex.exec(s)) !== null) {
    const [, name, minuteStr, detail] = match;
    // Parse minute: clean up ' and +, then compute
    const cleanMinute = minuteStr.replace(/'/g, '');
    let minute;
    if (cleanMinute.includes('+')) {
      const [base, extra] = cleanMinute.split('+').map(Number);
      minute = base + extra;
    } else {
      minute = parseInt(cleanMinute);
    }
    result.push({
      name: name.trim(),
      minute,
      minuteStr,
      detail: detail ? detail.trim() : undefined,
    });
  }
  return result;
}

const tests = [
  '{"K. Mbappé 66\'","B. Barcola 82\'","K. Mbappé 90+6\'"}',
  '{"Rvmanv Ashmid 21\'","Izn Alarb 76\'"}',
  '{"B. Khoukhi 90\'+5\'"}',
];

tests.forEach(t => {
  console.log('Input:', t);
  const parsed = parseScorers(t);
  parsed.forEach(p => console.log('  →', p.name, '|', p.minuteStr, '→', p.minute, '|', p.detail));
  console.log('');
});
