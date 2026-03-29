const fs = require('fs');
const path = require('path');

const ws = '/Users/nguyenvuphuc/Desktop/desktop/UIT/HỌC KÌ 4/WEB/NT208.Q21.ANTN';
const activitiesRoot = path.join(ws, 'GCompris-qt', 'src', 'activities');
const outFile = path.join(ws, 'frontend_new', 'src', 'data', 'gcomprisGames.json');

const categoryMeta = {
  reading: { icon: '🔤', bg: 'bg-amber-200' },
  math: { icon: '🔢', bg: 'bg-cyan-200' },
  logic: { icon: '🧩', bg: 'bg-fuchsia-200' },
  science: { icon: '🧪', bg: 'bg-emerald-200' },
  computer: { icon: '🖱️', bg: 'bg-indigo-200' }
};

function gradeFromDifficulty(d) {
  if (!Number.isFinite(d) || d <= 1) return 'PRE-K';
  if (d === 2) return 'PRE-K-1';
  if (d === 3) return 'K-2';
  if (d === 4) return '1-3';
  return '2-6+';
}

function mapCategory(section) {
  const s = (section || '').toLowerCase();

  if (['reading', 'word', 'vocabulary', 'alphabet', 'letter', 'phonics', 'grammar', 'language', 'braille'].some(k => s.includes(k))) {
    return 'reading';
  }

  if (['math', 'numeration', 'arithmetic', 'algebra', 'geometry', 'measure', 'money', 'fraction', 'calculation'].some(k => s.includes(k))) {
    return 'math';
  }

  if (['computer', 'keyboard', 'mouse', 'digital', 'programming', 'coding', 'internet'].some(k => s.includes(k))) {
    return 'computer';
  }

  if (['science', 'geography', 'nature', 'biology', 'physics', 'chemistry', 'astronomy', 'environment', 'experiment', 'earth'].some(k => s.includes(k))) {
    return 'science';
  }

  if (['logic', 'puzzle', 'memory', 'strategy', 'discovery', 'board', 'maze'].some(k => s.includes(k))) {
    return 'logic';
  }

  return 'logic';
}

function parseProp(text, prop) {
  const re = new RegExp(`(?:^|\\n)\\s*${prop}\\s*:\\s*([^\\n]+)`, 'm');
  const match = text.match(re);
  if (!match) return '';

  const raw = match[1].trim();
  const qsTrMatch = raw.match(/^qsTr\(\s*"([\s\S]*?)"\s*\)/);
  if (qsTrMatch) return qsTrMatch[1];

  const stringMatch = raw.match(/^"([\s\S]*?)"/);
  if (stringMatch) return stringMatch[1];

  const numberMatch = raw.match(/^(\d+)/);
  if (numberMatch) return Number(numberMatch[1]);

  return raw;
}

const activityDirs = fs
  .readdirSync(activitiesRoot, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

const entries = [];
for (const slug of activityDirs) {
  const file = path.join(activitiesRoot, slug, 'ActivityInfo.qml');
  if (!fs.existsSync(file)) continue;

  const text = fs.readFileSync(file, 'utf8');
  const title = parseProp(text, 'title') || slug.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const section = parseProp(text, 'section') || '';
  const diffRaw = parseProp(text, 'difficulty');
  const difficulty = typeof diffRaw === 'number' ? diffRaw : parseInt(String(diffRaw || '1'), 10);

  const category = mapCategory(section);
  const meta = categoryMeta[category];

  entries.push({
    slug,
    title,
    section,
    category,
    grade: gradeFromDifficulty(difficulty),
    icon: meta.icon,
    bg: meta.bg,
    path: '/dashboard'
  });
}

entries.sort((a, b) => a.slug.localeCompare(b.slug));
const catalog = entries.map((entry, index) => ({ id: index + 1, ...entry }));

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');

console.log(`WROTE ${outFile}`);
console.log(`COUNT ${catalog.length}`);
console.log(`FIRST5 ${catalog.slice(0, 5).map((x) => x.title).join(' | ')}`);
