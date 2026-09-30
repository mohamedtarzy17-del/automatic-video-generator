const path = require('path');
const fs = require('fs');

const root = process.cwd();
const TOPIC = process.env.VIDEO_TOPIC || 'Financial News';
const DURATION = Number(process.env.VIDEO_DURATION) || 30;
const LANGUAGE = process.env.VIDEO_LANGUAGE || 'English';
const STYLE = process.env.VIDEO_STYLE || 'Vox Financial';

// ---- Generate the manifest for VIDEO_TOPIC with Groq and write out/props.json
const SCENE_TYPES = ['intro', 'headline', 'bar-chart', 'line-chart', 'ticker', 'stat', 'comparison', 'quote', 'outro'];
const TONES = ['neutral', 'gain', 'loss'];

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const str = (v) => (typeof v === 'string' ? v.trim() : isNum(v) ? String(v) : '');
const num = (v) => {
  const n = typeof v === 'string' ? Number(v.replace(/[,%$\s]/g, '')) : v;
  return isNum(n) ? n : null;
};
// First non-empty string among several possible key names (LLMs often rename fields).
const pick = (o, ...keys) => {
  for (const k of keys) { const s = str(o && o[k]); if (s) return s; }
  return '';
};
const tone = (v) => (TONES.includes(v) ? v : undefined);

// Returns a valid scene (filling safe defaults) or null if the scene is unusable.
function sanitizeScene(sc, i, m) {
  if (!sc || typeof sc !== 'object') return null;
  const type = str(sc.type).toLowerCase().replace(/_/g, '-');
  if (!SCENE_TYPES.includes(type)) return null;

  const base = {
    type,
    durationSec: num(sc.durationSec) > 0 ? num(sc.durationSec) : 5,
    caption: pick(sc, 'caption', 'narration', 'voiceover', 'text') || undefined,
    source: pick(sc, 'source') || undefined,
  };
  const headlineFallback = (why) => {
    const h = pick(sc, 'headline', 'title', 'label', 'kicker') || base.caption;
    if (!h) return null;
    console.warn(`Scene ${i + 1} (${type}) was invalid (${why}); converted to a headline scene.`);
    return {...base, type: 'headline', headline: h, body: pick(sc, 'body', 'note', 'subtitle') || undefined};
  };

  switch (type) {
    case 'intro':
      return {...base, title: pick(sc, 'title', 'headline', 'text') || str(m.title) || TOPIC,
        subtitle: pick(sc, 'subtitle', 'kicker', 'body') || undefined};

    case 'headline': {
      const headline = pick(sc, 'headline', 'title', 'text') || base.caption;
      if (!headline) return null;
      return {...base, headline, kicker: pick(sc, 'kicker') || undefined,
        body: pick(sc, 'body', 'note', 'subtitle') || undefined, tone: tone(sc.tone)};
    }

    case 'bar-chart': {
      const data = (Array.isArray(sc.data) ? sc.data : [])
        .map((d) => ({label: pick(d, 'label', 'name'), value: num(d && d.value)}))
        .filter((d) => d.label && d.value !== null);
      if (!data.length) return headlineFallback('no valid data');
      return {...base, title: pick(sc, 'title', 'headline') || str(m.title) || TOPIC, data,
        valuePrefix: str(sc.valuePrefix) || undefined, valueSuffix: str(sc.valueSuffix) || undefined};
    }

    case 'line-chart': {
      const values = (Array.isArray(sc.values) ? sc.values : []).map(num).filter((v) => v !== null);
      if (values.length < 2) return headlineFallback('fewer than 2 values');
      const rawLabels = Array.isArray(sc.labels) ? sc.labels : [];
      // labels must match values one-to-one: trim extras, pad missing with ''
      const labels = values.map((_, k) => str(rawLabels[k]));
      return {...base, title: pick(sc, 'title', 'headline') || str(m.title) || TOPIC, labels, values,
        valuePrefix: str(sc.valuePrefix) || undefined, valueSuffix: str(sc.valueSuffix) || undefined};
    }

    case 'ticker': {
      const items = (Array.isArray(sc.items) ? sc.items : [])
        .map((t) => ({symbol: pick(t, 'symbol', 'ticker', 'name'), name: pick(t, 'name') || undefined,
          price: num(t && t.price), changePct: num(t && (t.changePct ?? t.change))}))
        .filter((t) => t.symbol && t.price !== null)
        .map((t) => ({...t, changePct: t.changePct === null ? 0 : t.changePct}));
      if (!items.length) return headlineFallback('no valid items');
      return {...base, title: pick(sc, 'title') || undefined, items, currency: str(sc.currency) || undefined};
    }

    case 'stat': {
      const value = num(sc.value);
      const label = pick(sc, 'label', 'title', 'headline') || base.caption;
      if (value === null || !label) return headlineFallback('missing value or label');
      const decimals = Number.isInteger(sc.decimals) && sc.decimals >= 0 && sc.decimals <= 4 ? sc.decimals : undefined;
      return {...base, label, value, prefix: str(sc.prefix) || undefined, suffix: str(sc.suffix) || undefined,
        decimals, note: pick(sc, 'note', 'body') || undefined, tone: tone(sc.tone)};
    }

    case 'comparison': {
      const side = (s, fallbackLabel) => {
        const value = pick(s, 'value', 'amount');
        if (!value) return null;
        return {label: pick(s, 'label', 'title') || fallbackLabel, value,
          note: pick(s, 'note') || undefined, tone: tone(s && s.tone)};
      };
      const left = side(sc.left, 'A');
      const right = side(sc.right, 'B');
      if (!left || !right) return headlineFallback('missing left/right');
      return {...base, title: pick(sc, 'title') || undefined, left, right};
    }

    case 'quote': {
      const quote = pick(sc, 'quote', 'text');
      if (!quote) return headlineFallback('missing quote');
      return {...base, quote, author: pick(sc, 'author', 'name') || 'Unknown', role: pick(sc, 'role') || undefined};
    }

    case 'outro':
      return {...base, title: pick(sc, 'title', 'headline', 'text') || base.caption || str(m.title) || TOPIC,
        cta: pick(sc, 'cta', 'subtitle') || undefined};
  }
  return null;
}

function normalizeManifest(m) {
  if (!m || typeof m !== 'object') throw new Error('AI response is not a JSON object.');
  // Some models wrap the result, e.g. {"manifest": {...}} or return a bare scenes array.
  if (Array.isArray(m)) m = {scenes: m};
  if (!Array.isArray(m.scenes) && m.manifest && Array.isArray(m.manifest.scenes)) m = m.manifest;
  if (!Array.isArray(m.scenes)) throw new Error('AI response has no "scenes" array.');

  let scenes = m.scenes.map((sc, i) => sanitizeScene(sc, i, m)).filter(Boolean);
  if (scenes.length < 2) throw new Error(`Only ${scenes.length} usable scene(s) after sanitizing.`);

  // Guarantee the structure: intro first, outro last.
  const title = str(m.title) || TOPIC;
  if (scenes[0].type !== 'intro') scenes.unshift({type: 'intro', durationSec: 4, title});
  if (scenes[scenes.length - 1].type !== 'outro') scenes.push({type: 'outro', durationSec: 4, title});

  // Assign ids and scale durations so the video lasts the requested time.
  const sum = scenes.reduce((a, sc) => a + sc.durationSec, 0);
  scenes = scenes.map((sc, i) => ({
    ...sc,
    id: `s${i + 1}`,
    durationSec: Math.max(1.5, Math.round(((sc.durationSec * DURATION) / sum) * 10) / 10),
  }));
  return {title, brand: str(m.brand) || undefined, captions: true, scenes};
}

// Pulls a JSON object out of the model output, even if wrapped in ```json fences or prose.
function extractJson(content) {
  const cleaned = content.replace(/```json|```/gi, '').trim();
  try { return JSON.parse(cleaned); } catch (_) { /* fall through */ }
  const a = cleaned.indexOf('{');
  const b = cleaned.lastIndexOf('}');
  if (a >= 0 && b > a) return JSON.parse(cleaned.slice(a, b + 1));
  throw new Error('no JSON object found');
}

function buildSystemPrompt(count) {
  const example = {
    title: 'Example title',
    brand: 'Example brand',
    scenes: [
      {type: 'intro', durationSec: 4, title: 'Main title', subtitle: 'Short subtitle', caption: 'Narration line.'},
      {type: 'headline', durationSec: 5, kicker: 'Context', headline: 'Key message', body: 'One supporting sentence.', tone: 'neutral', caption: 'Narration line.'},
      {type: 'line-chart', durationSec: 6, title: 'Chart title', labels: ['2020', '2021', '2022'], values: [10, 14, 21], valuePrefix: '$', source: 'Approximate figures', caption: 'Narration line.'},
      {type: 'bar-chart', durationSec: 6, title: 'Chart title', data: [{label: 'A', value: 30}, {label: 'B', value: 20}], caption: 'Narration line.'},
      {type: 'stat', durationSec: 5, label: 'What the number means', value: 42, suffix: '%', decimals: 0, note: 'Short note', tone: 'gain', caption: 'Narration line.'},
      {type: 'comparison', durationSec: 5, title: 'A vs B', left: {label: 'A', value: '$10K', note: 'note'}, right: {label: 'B', value: '$25K', note: 'note'}, caption: 'Narration line.'},
      {type: 'outro', durationSec: 4, title: 'Closing line', cta: 'Follow for more', caption: 'Narration line.'},
    ],
  };
  return [
    'You write scene manifests for a vertical financial documentary video.',
    'Reply with ONE valid JSON object and nothing else: no markdown, no code fences, no comments, no trailing commas.',
    'Top-level shape: {"title": string, "brand": string, "scenes": Scene[]}.',
    'EVERY scene MUST contain "type", "durationSec" (number) and "caption" (the narration line, one sentence).',
    'Field names are exact. Do not rename, omit or add fields. Required fields are marked with *.',
    '- intro: title*, subtitle',
    '- headline: headline*, kicker, body, tone ("neutral"|"gain"|"loss")',
    '- bar-chart: title*, data*: [{label*, value*}] (numbers only), valuePrefix, valueSuffix, source',
    '- line-chart: title*, labels*: string[], values*: number[] (same length as labels, at least 2), valuePrefix, valueSuffix, source',
    '- ticker: title, items*: [{symbol*, name, price* (number), changePct* (number)}]',
    '- stat: label*, value* (number, not a string), prefix, suffix, decimals, note, tone',
    '- comparison: title, left*: {label*, value* (string), note}, right*: {label*, value* (string), note}',
    '- quote: quote*, author*, role',
    '- outro: title*, cta',
    `Use exactly ${count} scenes. The first scene is "intro" and the last is "outro". Durations must add up to about ${DURATION} seconds.`,
    `Write ALL on-screen text and captions in ${LANGUAGE}. Visual style: ${STYLE}.`,
    'All numbers must be plain JSON numbers (no "$", "%", commas or units inside numeric fields; put those in prefix/suffix).',
    'Use only well-known facts and round figures. If unsure of a number, do not invent precision; say it is approximate in "source".',
    'Example of the exact format (structure only, do not copy the content):',
    JSON.stringify(example),
  ].join('\n');
}

async function callGroq(key, model, messages, attempt) {
  const isGptOss = /gpt-oss/i.test(model);
  const body = {
    model,
    max_completion_tokens: 8192,
    temperature: attempt === 0 ? 0.5 : 0.2,
    response_format: {type: 'json_object'},
    messages,
  };
  // reasoning_effort is only accepted by reasoning models (gpt-oss); keep it low to save tokens.
  if (isGptOss) body.reasoning_effort = process.env.GROQ_REASONING_EFFORT || 'low';

  const res = await fetch('[https://api.groq.com/openai/v1/chat/completions](https://api.groq.com/openai/v1/chat/completions)', {
    method: 'POST',
    headers: {'Content-Type': 'application/json', Authorization: `Bearer ${key}`},
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Groq API ${res.status} (${model}): ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  const content = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  if (!content) throw new Error(`Groq returned an empty response (${model}).`);
  return content;
}

async function generateManifest() {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error('GROQ_API_KEY is missing. Add it as a repository secret.');
  const count = Math.min(12, Math.max(3, Math.round(DURATION / 5)));
  const system = buildSystemPrompt(count);

  // GROQ_MODEL overrides the first choice; the rest are fallbacks if a model is retired or errors out.
  const models = [process.env.GROQ_MODEL, 'openai/gpt-oss-120b', 'openai/gpt-oss-20b']
    .filter(Boolean)
    .filter((m, i, arr) => arr.indexOf(m) === i);

  const messages = [
    {role: 'system', content: system},
    {role: 'user', content: `Topic: ${TOPIC}\nReturn the JSON object now.`},
  ];

  let lastErr;
  const MAX_ATTEMPTS = 4;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const model = models[Math.min(attempt, models.length - 1)];
    try {
      console.log(`Groq attempt ${attempt + 1}/${MAX_ATTEMPTS} with ${model}`);
      const content = await callGroq(key, model, messages, attempt);
      const parsed = extractJson(content);
      return normalizeManifest(parsed);
    } catch (err) {
      lastErr = err;
      console.warn(`Attempt ${attempt + 1} failed: ${err.message}`);
      // Retry with feedback so the model can correct itself.
      messages.push({
        role: 'user',
        content: `Your previous reply was rejected: ${err.message}. Reply again with ONE complete JSON object that follows the schema exactly.`,
      });
    }
  }
  throw new Error(`All ${MAX_ATTEMPTS} attempts failed. Last error: ${lastErr && lastErr.message}`);
}

generateManifest()
  .then((manifest) => {
    const outDir = path.join(root, 'out');
    fs.mkdirSync(outDir, {recursive: true});
    fs.writeFileSync(path.join(outDir, 'props.json'), JSON.stringify({manifest}, null, 2), 'utf8');
    console.log(`Wrote out/props.json for "${manifest.title}" (${manifest.scenes.length} scenes).`);
  })
  .catch((err) => { console.error('Generation failed: ' + err.message); process.exit(1); });
