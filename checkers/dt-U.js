module.exports = (input, output, answer) => {
  const a = String(output).split(/\s+/).filter(Boolean);
  const b = String(answer).split(/\s+/).filter(Boolean);
  if (a.length !== b.length) return { ok: false, msg: 'Số dòng kết quả sai: in ' + a.length + ', cần ' + b.length };
  for (let i = 0; i < b.length; i++) {
    if (!/^[-+]?\d+(\.\d+)?$/.test(a[i])) return { ok: false, msg: 'Test ' + (i + 1) + ': "' + a[i].slice(0, 30) + '" không phải số thực hợp lệ' };
    const x = parseFloat(a[i]), y = parseFloat(b[i]);
    if (!isFinite(x)) return { ok: false, msg: 'Test ' + (i + 1) + ': giá trị không hợp lệ' };
    if (Math.abs(x - y) > 2e-6 + 1e-9 * Math.abs(y)) return { ok: false, msg: 'Test ' + (i + 1) + ': in ' + a[i] + ', cần ' + b[i] + ' (sai số cho phép 1e-6)' };
  }
  return { ok: true, msg: '' };
};
