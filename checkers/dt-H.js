module.exports = (input, output, answer) => {
  const raw = String(output).split(/\s+/).filter(Boolean);
  const a = raw.map(s => s.toLowerCase());
  const b = String(answer).split(/\s+/).filter(Boolean).map(s => s.toLowerCase());
  if (a.length !== b.length) return { ok: false, msg: 'Số dòng đáp án sai: in ' + a.length + ', cần ' + b.length };
  for (let i = 0; i < b.length; i++) {
    if (a[i] !== 'yes' && a[i] !== 'no') return { ok: false, msg: 'Truy vấn ' + (i + 1) + ': "' + raw[i].slice(0, 30) + '" không phải Yes/No' };
    if (a[i] !== b[i]) return { ok: false, msg: 'Truy vấn ' + (i + 1) + ': in ' + a[i] + ', cần ' + b[i] };
  }
  return { ok: true, msg: '' };
};
