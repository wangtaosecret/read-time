// 阅读时间 — 全部计算在浏览器本地完成，不发送任何请求。

const WORDS_PER_MINUTE = 400;

const textEl = document.getElementById('text');
const wordsEl = document.getElementById('words');
const timeEl = document.getElementById('time');
const charsEl = document.getElementById('chars');
const clearEl = document.getElementById('clear');

// 中日韩统一表意文字（含扩展 A 与兼容表意文字）
const CJK = /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\u3040-\u30FF\uAC00-\uD7AF]/;


function countWords(raw) {
  let count = 0;
  let cjk = 0;

  // 逐字符扫描：CJK 每字计 1，其余按西文单词边界计 1
  let inWord = false;
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];

    if (CJK.test(ch)) {
      cjk++;
      inWord = false;
      continue;
    }

    if (/[A-Za-z0-9]/.test(ch)) {
      if (!inWord) {
        count++;
        inWord = true;
      }
      continue;
    }

    // 连字符连接的后续片段并入当前单词
    if (inWord && (ch === "'" || ch === '’' || ch === '-')) {
      const next = raw[i + 1];
      if (next && /[A-Za-z0-9]/.test(next)) continue;
    }

    inWord = false;
  }

  return cjk + count;
}

function formatMinutes(words) {
  if (words <= 0) return '不到 1 分钟';
  const minutes = words / WORDS_PER_MINUTE;
  if (minutes < 1) return '不到 1 分钟';
  const rounded = Math.round(minutes);
  return rounded + ' 分钟';
}

function update() {
  const raw = textEl.value;

  const words = countWords(raw);
  const chars = raw.replace(/\s/g, '').length;

  wordsEl.textContent = words.toLocaleString('zh-CN');
  timeEl.textContent = formatMinutes(words);
  charsEl.textContent = chars.toLocaleString('zh-CN');
}

textEl.addEventListener('input', update);

clearEl.addEventListener('click', () => {
  textEl.value = '';
  update();
  textEl.focus();
});

update();
