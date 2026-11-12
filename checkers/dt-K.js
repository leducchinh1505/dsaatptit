module.exports = (input, output, answer) => {
  const a = String(output).split(/\s+/).filter(Boolean);
  const b = String(answer).split(/\s+/).filter(Boolean);
  if (a.length !== 1) return { ok: false, msg: 'Cần in đúng một số, đã in ' + a.length + ' token' };
  if (!/^[-+]?\d+(\.\d+)?$/.test(a[0])) return { ok: false, msg: 'Không phải số thực hợp lệ: "' + a[0].slice(0, 30) + '"' };
  const x = parseFloat(a[0]), y = parseFloat(b[0]);
  if (!isFinite(x)) return { ok: false, msg: 'Giá trị không hợp lệ' };
  if (Math.abs(x - y) > 0.0101 + 1e-12 * Math.abs(y)) return { ok: false, msg: 'Sai số quá 0.01: in ' + a[0] + ', cần ' + b[0] };
  return { ok: true, msg: '' };
};
