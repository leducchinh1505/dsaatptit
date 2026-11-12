// Trình chấm cục bộ cho Sổ luyện DSA. Chạy bằng Mo-so-luyen.bat, không cần cài thêm gói nào.
// Chỉ nghe trên 127.0.0.1 và từ chối yêu cầu đến từ trang web khác, vì máy chủ này biên dịch và chạy code.
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os'), cp = require('child_process');

const PORT = 8731;
const ROOT = __dirname;
const TESTS = path.join(ROOT, 'tests');
const CHECKERS = path.join(ROOT, 'checkers');
const PAGE = path.join(ROOT, 'so-luyen-dsa.html');
const MAX_CODE = 512 * 1024;
const MAX_OUTPUT = 64 * 1024 * 1024;
const PREVIEW = 4000;
const COMPILE_TIMEOUT = 60000;
const ALLOWED_HOSTS = new Set([`127.0.0.1:${PORT}`, `localhost:${PORT}`]);

function findGpp() {
  const names = ['g++'];
  for (const d of ['C:/msys64/mingw64/bin', 'C:/msys64/ucrt64/bin', 'C:/MinGW/bin', 'C:/Program Files/mingw64/bin', 'C:/Program Files (x86)/Dev-Cpp/MinGW64/bin', 'C:/Program Files/CodeBlocks/MinGW/bin'])
    names.push(path.join(d, 'g++.exe'));
  for (const n of names) {
    const r = cp.spawnSync(n, ['--version'], { encoding: 'utf8' });
    if (r.status === 0) return { path: n, version: r.stdout.split('\n')[0].trim() };
  }
  return null;
}
const GPP = findGpp();

function testKeys() {
  if (!fs.existsSync(TESTS)) return [];
  return fs.readdirSync(TESTS).filter(k => listTests(k).length > 0);
}
function listTests(key) {
  const d = path.join(TESTS, key);
  if (!fs.existsSync(d)) return [];
  return fs.readdirSync(d).filter(f => f.endsWith('.in')).sort().map(f => f.slice(0, -3)).filter(n => fs.existsSync(path.join(d, n + '.ans')));
}

const tokens = s => s.split(/\s+/).filter(Boolean);
function defaultCheck(_input, output, answer) {
  const a = tokens(output), b = tokens(answer);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i] === undefined) return { ok: false, msg: `Output thiếu: sau ${a.length} token đã hết, cần thêm "${b[i]}".` };
    if (b[i] === undefined) return { ok: false, msg: `Output thừa từ token ${i + 1}: "${a[i].slice(0, 60)}".` };
    if (a[i] !== b[i]) return { ok: false, msg: `Khác ở token ${i + 1}: bạn in "${a[i].slice(0, 60)}", cần "${b[i].slice(0, 60)}".` };
  }
  return { ok: true, msg: '' };
}
function loadChecker(key) {
  const f = path.join(CHECKERS, key + '.js');
  return fs.existsSync(f) ? require(f) : defaultCheck;
}

function compile(code, dir) {
  return new Promise(resolve => {
    const src = path.join(dir, 'main.cpp'), exe = path.join(dir, 'main.exe');
    fs.writeFileSync(src, code);
    const t0 = Date.now();
    const p = cp.spawn(GPP.path, ['-std=c++17', '-O2', '-static', '-Wl,--stack=268435456', '-o', exe, src], { cwd: dir });
    let log = '';
    p.stderr.on('data', d => { if (log.length < 16000) log += d; });
    p.stdout.on('data', () => {});
    const timer = setTimeout(() => { log += '\nBiên dịch quá 60 giây.'; p.kill(); }, COMPILE_TIMEOUT);
    p.on('error', e => { clearTimeout(timer); resolve({ ok: false, log: String(e), ms: Date.now() - t0, exe }); });
    p.on('close', c => { clearTimeout(timer); resolve({ ok: c === 0, log: log.split(dir + path.sep).join('').split(src).join('main.cpp').slice(0, 8000), ms: Date.now() - t0, exe }); });
  });
}

// Time limit tính theo thời gian thực. Tiến trình được chạy thêm một ít rồi mới bị dừng để đo được số ms thật.
function runOne(exe, input, tlMs, state, cwd) {
  return new Promise(resolve => {
    const t0 = process.hrtime.bigint();
    const p = cp.spawn(exe, [], { cwd, windowsHide: true });
    state.child = p;
    const chunks = []; let size = 0, overflow = false, killedByTime = false;
    p.stdout.on('data', d => {
      size += d.length;
      if (size > MAX_OUTPUT) { overflow = true; p.kill(); return; }
      chunks.push(d);
    });
    p.stderr.on('data', () => {});
    p.stdin.on('error', () => {});
    p.stdin.end(input);
    const timer = setTimeout(() => { killedByTime = true; p.kill(); }, tlMs * 2 + 500);
    const finish = (code, err) => {
      clearTimeout(timer); state.child = null;
      const ms = Number(process.hrtime.bigint() - t0) / 1e6;
      resolve({ out: Buffer.concat(chunks).toString('utf8'), code, ms: Math.round(ms), killedByTime, overflow, err });
    };
    p.on('error', e => finish(-1, e));
    p.on('close', c => finish(c));
  });
}

function exitMessage(code) {
  const u = (code >>> 0);
  const known = { 0xC00000FD: 'tràn stack, thường do đệ quy quá sâu', 0xC0000005: 'truy cập sai bộ nhớ, thường do tràn mảng hoặc con trỏ lỗi', 0xC0000094: 'chia cho 0', 0xC0000409: 'kết thúc bất thường', 3: 'gọi abort hoặc ném ngoại lệ không bắt' };
  return known[u] ? `Thoát với mã ${code}: ${known[u]}.` : `Thoát với mã ${code}.`;
}
const clip = s => s.length > PREVIEW ? s.slice(0, PREVIEW) + `\n… (còn ${s.length - PREVIEW} ký tự)` : s;

let busy = false;
async function judge(body, send, state) {
  const { key, code } = body;
  const tl = Math.min(10, Math.max(0.5, Number(body.tl) || 2));
  const names = listTests(key);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'so-luyen-dsa-'));
  try {
    const c = await compile(code, dir);
    send({ type: 'compile', ok: c.ok, log: c.log, ms: c.ms });
    if (!c.ok) { send({ type: 'done', passed: 0, total: names.length, compileError: true }); return; }
    // Lần chạy nháp để phần mềm diệt virus quét xong file mới, tránh tính nhầm vào test đầu tiên.
    await runOne(c.exe, '', 500, state, dir).catch(() => {});
    let check, checkerBroken = null;
    try { check = loadChecker(key); } catch (e) { checkerBroken = String(e); check = defaultCheck; }
    let passed = 0;
    for (let i = 0; i < names.length; i++) {
      if (state.aborted) return;
      const n = names[i];
      const input = fs.readFileSync(path.join(TESTS, key, n + '.in'), 'utf8');
      const answer = fs.readFileSync(path.join(TESTS, key, n + '.ans'), 'utf8');
      const r = await runOne(c.exe, input, tl * 1000, state, dir);
      if (state.aborted) return;
      let verdict, msg = '';
      if (r.overflow) { verdict = 'OLE'; msg = 'In ra quá 64 MB.'; }
      else if (r.killedByTime || r.ms > tl * 1000) { verdict = 'TLE'; msg = `Chạy ${r.killedByTime ? 'quá ' + (tl * 2 + 0.5) + ' s và bị dừng' : r.ms + ' ms'}, giới hạn ${tl} s.`; }
      else if (r.err) { verdict = 'RE'; msg = String(r.err); }
      else if (r.code !== 0) { verdict = 'RE'; msg = exitMessage(r.code); }
      else {
        let v;
        try { v = check(input, r.out, answer) || { ok: false, msg: 'Checker không trả kết quả.' }; }
        catch (e) { v = { ok: false, msg: 'Checker lỗi: ' + e.message, broken: true }; }
        verdict = v.broken ? 'CHK' : v.ok ? 'AC' : 'WA'; msg = v.msg || '';
      }
      if (verdict === 'AC') passed++;
      const ev = { type: 'test', n: i + 1, verdict, ms: r.ms, msg };
      if (verdict !== 'AC') { ev.input = clip(input); ev.output = clip(r.out); ev.answer = clip(answer); }
      send(ev);
    }
    send({ type: 'done', passed, total: names.length, checkerBroken });
  } finally {
    setTimeout(() => fs.rm(dir, { recursive: true, force: true }, () => {}), 500);
  }
}

function allowed(req) {
  if (!ALLOWED_HOSTS.has(req.headers.host)) return false;
  if (req.method === 'GET') return true;
  const o = req.headers.origin;
  if (!o || !ALLOWED_HOSTS.has(o.replace(/^http:\/\//, ''))) return false;
  return (req.headers['content-type'] || '').startsWith('application/json');
}
const json = (res, code, obj) => { res.writeHead(code, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }); res.end(JSON.stringify(obj)); };

const server = http.createServer((req, res) => {
  if (!allowed(req)) return json(res, 403, { error: 'Yêu cầu bị từ chối.' });
  const url = req.url.split('?')[0];
  if (req.method === 'GET' && (url === '/' || url === '/so-luyen-dsa.html')) {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-frame-options': 'DENY' });
    return res.end(fs.readFileSync(PAGE));
  }
  if (req.method === 'GET' && url === '/favicon.ico') { res.writeHead(204); return res.end(); }
  if (req.method === 'GET' && url === '/api/status') {
    return json(res, 200, { compiler: GPP && GPP.version, keys: testKeys() });
  }
  if (req.method === 'POST' && url === '/api/judge') {
    let raw = '', tooBig = false;
    req.on('data', d => { if (raw.length > MAX_CODE * 2) { tooBig = true; return; } raw += d; });
    req.on('end', () => {
      if (tooBig) return json(res, 413, { error: 'Code quá lớn.' });
      let body;
      try { body = JSON.parse(raw); } catch (e) { return json(res, 400, { error: 'Dữ liệu không hợp lệ.' }); }
      if (typeof body.key !== 'string' || !/^[a-z0-9]+-[A-Za-z0-9]+$/.test(body.key) || typeof body.code !== 'string') return json(res, 400, { error: 'Dữ liệu không hợp lệ.' });
      if (body.code.length > MAX_CODE) return json(res, 413, { error: 'Code quá lớn.' });
      if (!GPP) return json(res, 500, { error: 'Không tìm thấy g++ trên máy.' });
      if (!listTests(body.key).length) return json(res, 404, { error: 'Bài này chưa có test.' });
      if (busy) return json(res, 409, { error: 'Đang chấm một bài khác, hãy đợi xong.' });
      busy = true;
      res.writeHead(200, { 'content-type': 'application/x-ndjson; charset=utf-8', 'cache-control': 'no-store' });
      const state = { aborted: false, child: null };
      res.on('close', () => { if (!res.writableEnded) { state.aborted = true; if (state.child) state.child.kill(); } });
      judge(body, ev => { if (!res.writableEnded) res.write(JSON.stringify(ev) + '\n'); }, state)
        .catch(e => { if (!res.writableEnded) res.write(JSON.stringify({ type: 'error', msg: String(e) }) + '\n'); })
        .finally(() => { busy = false; res.end(); });
    });
    return;
  }
  json(res, 404, { error: 'Không có trang này.' });
});

const pageUrl = `http://127.0.0.1:${PORT}/`;
const openBrowser = () => { if (!process.argv.includes('--no-open')) cp.exec(`start "" "${pageUrl}"`); };
server.on('error', e => {
  if (e.code === 'EADDRINUSE') {
    console.log(`Cổng ${PORT} đang được dùng, có thể trình chấm đã chạy sẵn. Đang mở ${pageUrl}`);
    openBrowser();
    setTimeout(() => process.exit(0), 1500);
  } else { console.error(e); process.exit(1); }
});
server.listen(PORT, '127.0.0.1', () => {
  console.log(`Sổ luyện DSA: ${pageUrl}`);
  console.log(GPP ? `Trình biên dịch: ${GPP.version}` : 'CHƯA tìm thấy g++. Trang vẫn mở được nhưng không chấm được.');
  console.log(`Đã có test cho ${testKeys().length} bài. Đóng cửa sổ này để tắt trình chấm.`);
  openBrowser();
});
