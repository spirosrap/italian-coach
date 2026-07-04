const STORAGE_KEY = "italian-coach-state-v1";
const CLIENT_ID_KEY = "italian-coach-client-id-v1";
const DEFAULT_SYNC_SERVER = "";
const todayKey = () => new Date().toISOString().slice(0, 10);

const COURSE = [
  { id: "ciao", skill: "Greetings", focus: "balanced", level: 1, it: "ciao", en: "hi / bye", accepted: ["ciao"], hint: "Works for hello and goodbye with people you know." },
  { id: "buongiorno", skill: "Greetings", focus: "balanced", level: 1, it: "buongiorno", en: "good morning", accepted: ["buongiorno", "buon giorno"], hint: "Use it until the afternoon." },
  { id: "buonasera", skill: "Greetings", focus: "balanced", level: 1, it: "buonasera", en: "good evening", accepted: ["buonasera", "buona sera"], hint: "Use it late afternoon onward." },
  { id: "per-favore", skill: "Survival", focus: "travel", level: 1, it: "per favore", en: "please", accepted: ["per favore"], hint: "The phrase that makes every request softer." },
  { id: "grazie", skill: "Survival", focus: "travel", level: 1, it: "grazie", en: "thank you", accepted: ["grazie"], hint: "The z sounds like ts." },
  { id: "prego", skill: "Survival", focus: "travel", level: 1, it: "prego", en: "you're welcome", accepted: ["prego"], hint: "Also used like go ahead." },
  { id: "scusi", skill: "Survival", focus: "travel", level: 1, it: "scusi", en: "excuse me", accepted: ["scusi"], hint: "Polite form for strangers." },
  { id: "mi-dispiace", skill: "Survival", focus: "balanced", level: 1, it: "mi dispiace", en: "I'm sorry", accepted: ["mi dispiace"], hint: "Useful when apologizing or showing sympathy." },
  { id: "come-stai", skill: "Greetings", focus: "balanced", level: 1, it: "come stai?", en: "how are you?", accepted: ["come stai", "come stai?"], hint: "Informal, for one person." },
  { id: "sto-bene", skill: "Greetings", focus: "balanced", level: 1, it: "sto bene", en: "I am well", accepted: ["sto bene"], hint: "A short answer to come stai." },
  { id: "mi-chiamo", skill: "Introductions", focus: "balanced", level: 1, it: "mi chiamo Luca", en: "my name is Luca", accepted: ["mi chiamo luca"], hint: "Swap your name in after mi chiamo." },
  { id: "piacere", skill: "Introductions", focus: "balanced", level: 1, it: "piacere", en: "nice to meet you", accepted: ["piacere"], hint: "Literally pleasure." },
  { id: "non-capisco", skill: "Survival", focus: "travel", level: 1, it: "non capisco", en: "I don't understand", accepted: ["non capisco"], hint: "A survival sentence worth overlearning." },
  { id: "puo-ripetere", skill: "Survival", focus: "travel", level: 2, it: "può ripetere?", en: "can you repeat?", accepted: ["puo ripetere", "può ripetere", "puo ripetere?"], hint: "Polite form: puo." },
  { id: "parla-inglese", skill: "Survival", focus: "travel", level: 1, it: "parla inglese?", en: "do you speak English?", accepted: ["parla inglese", "parla inglese?"], hint: "Polite one-person form." },
  { id: "vorrei-caffe", skill: "Cafe", focus: "food", level: 1, it: "vorrei un caffè", en: "I would like a coffee", accepted: ["vorrei un caffe", "vorrei un caffè"], hint: "Vorrei is the polite powerhouse." },
  { id: "conto", skill: "Cafe", focus: "food", level: 1, it: "il conto, per favore", en: "the bill, please", accepted: ["il conto per favore", "il conto, per favore"], hint: "A clean restaurant phrase." },
  { id: "quanto-costa", skill: "Shopping", focus: "travel", level: 1, it: "quanto costa?", en: "how much does it cost?", accepted: ["quanto costa", "quanto costa?"], hint: "Costa is it costs." },
  { id: "posso-avere", skill: "Cafe", focus: "food", level: 1, it: "posso avere dell'acqua?", en: "can I have some water?", accepted: ["posso avere dell'acqua", "posso avere dell acqua", "posso avere dellacqua"], hint: "Posso avere = can I have." },
  { id: "senza-zucchero", skill: "Cafe", focus: "food", level: 1, it: "senza zucchero", en: "without sugar", accepted: ["senza zucchero"], hint: "Senza is without." },
  { id: "acqua", skill: "Cafe", focus: "food", level: 1, it: "acqua", en: "water", accepted: ["acqua"], hint: "Double c, q sound." },
  { id: "pane", skill: "Cafe", focus: "food", level: 1, it: "pane", en: "bread", accepted: ["pane"], hint: "Pan-eh." },
  { id: "latte", skill: "Cafe", focus: "food", level: 1, it: "latte", en: "milk", accepted: ["latte"], hint: "In Italian, latte means milk." },
  { id: "colazione", skill: "Food", focus: "food", level: 1, it: "colazione", en: "breakfast", accepted: ["colazione"], hint: "La colazione." },
  { id: "pranzo", skill: "Food", focus: "food", level: 1, it: "pranzo", en: "lunch", accepted: ["pranzo"], hint: "Il pranzo." },
  { id: "cena", skill: "Food", focus: "food", level: 1, it: "cena", en: "dinner", accepted: ["cena"], hint: "La cena." },
  { id: "ho-fame", skill: "Food", focus: "food", level: 1, it: "ho fame", en: "I am hungry", accepted: ["ho fame"], hint: "Italian says I have hunger." },
  { id: "ho-sete", skill: "Food", focus: "food", level: 1, it: "ho sete", en: "I am thirsty", accepted: ["ho sete"], hint: "Italian says I have thirst." },
  { id: "biglietto", skill: "Travel", focus: "travel", level: 1, it: "un biglietto", en: "a ticket", accepted: ["un biglietto"], hint: "Gli makes the gli sound in the middle." },
  { id: "stazione", skill: "Travel", focus: "travel", level: 1, it: "la stazione", en: "the station", accepted: ["la stazione"], hint: "Usually train station by default." },
  { id: "aeroporto", skill: "Travel", focus: "travel", level: 1, it: "l'aeroporto", en: "the airport", accepted: ["l'aeroporto", "laeroporto", "l aeroporto"], hint: "Starts with a vowel, so l'." },
  { id: "treno", skill: "Travel", focus: "travel", level: 1, it: "il treno", en: "the train", accepted: ["il treno"], hint: "Il with masculine singular." },
  { id: "autobus", skill: "Travel", focus: "travel", level: 1, it: "l'autobus", en: "the bus", accepted: ["l'autobus", "l autobus", "lautobus"], hint: "Autobus is masculine and invariable." },
  { id: "andata", skill: "Travel", focus: "travel", level: 2, it: "solo andata", en: "one way", accepted: ["solo andata"], hint: "Only going." },
  { id: "ritorno", skill: "Travel", focus: "travel", level: 2, it: "andata e ritorno", en: "round trip", accepted: ["andata e ritorno"], hint: "Going and return." },
  { id: "parte", skill: "Travel", focus: "travel", level: 2, it: "a che ora parte?", en: "what time does it leave?", accepted: ["a che ora parte", "a che ora parte?"], hint: "Parte = leaves/departs." },
  { id: "dove-bagno", skill: "Travel", focus: "travel", level: 1, it: "dov'è il bagno?", en: "where is the bathroom?", accepted: ["dov'e il bagno", "dovè il bagno", "dove il bagno", "dov'e il bagno?"], hint: "Dov'e = where is." },
  { id: "prenotazione", skill: "Travel", focus: "travel", level: 2, it: "ho una prenotazione", en: "I have a reservation", accepted: ["ho una prenotazione"], hint: "Useful at hotels and restaurants." },
  { id: "destra", skill: "Directions", focus: "travel", level: 1, it: "a destra", en: "to the right", accepted: ["a destra"], hint: "Right side." },
  { id: "sinistra", skill: "Directions", focus: "travel", level: 1, it: "a sinistra", en: "to the left", accepted: ["a sinistra"], hint: "Left side." },
  { id: "dritto", skill: "Directions", focus: "travel", level: 1, it: "sempre dritto", en: "straight ahead", accepted: ["sempre dritto"], hint: "Keep going straight." },
  { id: "vicino", skill: "Directions", focus: "travel", level: 1, it: "è vicino", en: "it is nearby", accepted: ["e vicino", "è vicino"], hint: "Vicino = near." },
  { id: "lontano", skill: "Directions", focus: "travel", level: 1, it: "è lontano", en: "it is far", accepted: ["e lontano", "è lontano"], hint: "Lontano = far." },
  { id: "io-sono", skill: "Verbs", focus: "verbs", level: 1, it: "io sono", en: "I am", accepted: ["io sono"], hint: "Essere, first person." },
  { id: "tu-sei", skill: "Verbs", focus: "verbs", level: 1, it: "tu sei", en: "you are", accepted: ["tu sei"], hint: "Informal you." },
  { id: "lui-e", skill: "Verbs", focus: "verbs", level: 1, it: "lui è", en: "he is", accepted: ["lui e", "lui è"], hint: "Accent matters in writing, but this app accepts e." },
  { id: "noi-siamo", skill: "Verbs", focus: "verbs", level: 1, it: "noi siamo", en: "we are", accepted: ["noi siamo"], hint: "Noi = we." },
  { id: "io-ho", skill: "Verbs", focus: "verbs", level: 1, it: "io ho", en: "I have", accepted: ["io ho"], hint: "H is silent." },
  { id: "tu-hai", skill: "Verbs", focus: "verbs", level: 1, it: "tu hai", en: "you have", accepted: ["tu hai"], hint: "Avere, informal you." },
  { id: "posso", skill: "Verbs", focus: "verbs", level: 1, it: "posso", en: "I can", accepted: ["posso"], hint: "A modal verb you will use constantly." },
  { id: "devo", skill: "Verbs", focus: "verbs", level: 1, it: "devo", en: "I must / I have to", accepted: ["devo"], hint: "Devo partire = I have to leave." },
  { id: "voglio", skill: "Verbs", focus: "verbs", level: 1, it: "voglio", en: "I want", accepted: ["voglio"], hint: "Use vorrei when you want to sound softer." },
  { id: "mi-piace", skill: "Verbs", focus: "verbs", level: 2, it: "mi piace", en: "I like it", accepted: ["mi piace"], hint: "Literally it pleases me." },
  { id: "mi-piacciono", skill: "Verbs", focus: "verbs", level: 2, it: "mi piacciono", en: "I like them", accepted: ["mi piacciono"], hint: "Plural things need piacciono." },
  { id: "oggi", skill: "Time", focus: "balanced", level: 1, it: "oggi", en: "today", accepted: ["oggi"], hint: "Oggi vado = today I go." },
  { id: "domani", skill: "Time", focus: "balanced", level: 1, it: "domani", en: "tomorrow", accepted: ["domani"], hint: "Tomorrow." },
  { id: "ieri", skill: "Time", focus: "balanced", level: 1, it: "ieri", en: "yesterday", accepted: ["ieri"], hint: "Yesterday." },
  { id: "adesso", skill: "Time", focus: "balanced", level: 1, it: "adesso", en: "now", accepted: ["adesso"], hint: "Right now." },
  { id: "presto", skill: "Time", focus: "balanced", level: 1, it: "presto", en: "early / soon", accepted: ["presto"], hint: "Context decides early or soon." },
  { id: "tardi", skill: "Time", focus: "balanced", level: 1, it: "tardi", en: "late", accepted: ["tardi"], hint: "E tardi = it is late." },
  { id: "alle-otto", skill: "Time", focus: "balanced", level: 2, it: "alle otto", en: "at eight o'clock", accepted: ["alle otto"], hint: "Alle for plural clock hours." },
  { id: "grande", skill: "Descriptions", focus: "balanced", level: 1, it: "grande", en: "big", accepted: ["grande"], hint: "Can be masculine or feminine." },
  { id: "piccolo", skill: "Descriptions", focus: "balanced", level: 1, it: "piccolo", en: "small", accepted: ["piccolo"], hint: "Piccola for feminine." },
  { id: "bello", skill: "Descriptions", focus: "balanced", level: 1, it: "bello", en: "beautiful / nice", accepted: ["bello"], hint: "Flexible compliment word." },
  { id: "buono", skill: "Descriptions", focus: "food", level: 1, it: "buono", en: "good / tasty", accepted: ["buono"], hint: "Often for food and quality." },
  { id: "caro", skill: "Shopping", focus: "travel", level: 1, it: "caro", en: "expensive", accepted: ["caro"], hint: "Cara for feminine." },
  { id: "economico", skill: "Shopping", focus: "travel", level: 1, it: "economico", en: "cheap / inexpensive", accepted: ["economico"], hint: "Economica for feminine." },
  { id: "aperto", skill: "Travel", focus: "travel", level: 1, it: "aperto", en: "open", accepted: ["aperto"], hint: "Aperta for feminine." },
  { id: "chiuso", skill: "Travel", focus: "travel", level: 1, it: "chiuso", en: "closed", accepted: ["chiuso"], hint: "Chiusa for feminine." },
  { id: "vado-mercato", skill: "Sentences", focus: "balanced", level: 2, it: "vado al mercato", en: "I go to the market", accepted: ["vado al mercato"], hint: "A + il becomes al." },
  { id: "prendo-treno", skill: "Travel", focus: "travel", level: 2, it: "prendo il treno", en: "I take the train", accepted: ["prendo il treno"], hint: "Prendere = to take." },
  { id: "sto-cercando", skill: "Travel", focus: "travel", level: 2, it: "sto cercando la stazione", en: "I am looking for the station", accepted: ["sto cercando la stazione"], hint: "Sto cercando = I am looking for." },
  { id: "mi-serve", skill: "Shopping", focus: "travel", level: 2, it: "mi serve una SIM", en: "I need a SIM", accepted: ["mi serve una sim"], hint: "Mi serve = I need, for one thing." },
  { id: "carta", skill: "Shopping", focus: "travel", level: 2, it: "posso pagare con la carta?", en: "can I pay by card?", accepted: ["posso pagare con la carta", "posso pagare con la carta?"], hint: "Con la carta = with card." },
  { id: "tempo-ci-vuole", skill: "Travel", focus: "travel", level: 2, it: "quanto tempo ci vuole?", en: "how long does it take?", accepted: ["quanto tempo ci vuole", "quanto tempo ci vuole?"], hint: "A very useful logistics phrase." },
  { id: "sono-stanco", skill: "Sentences", focus: "balanced", level: 2, it: "sono stanco", en: "I am tired", accepted: ["sono stanco"], hint: "Stanca if feminine." },
  { id: "imparare", skill: "Sentences", focus: "balanced", level: 2, it: "voglio imparare l'italiano", en: "I want to learn Italian", accepted: ["voglio imparare l'italiano", "voglio imparare l italiano", "voglio imparare litaliano"], hint: "Imparare = to learn." },
  { id: "ho-mangiato", skill: "Past tense", focus: "verbs", level: 3, it: "ho mangiato", en: "I ate / I have eaten", accepted: ["ho mangiato"], hint: "Avere + past participle." },
  { id: "sono-andato", skill: "Past tense", focus: "verbs", level: 3, it: "sono andato", en: "I went", accepted: ["sono andato"], hint: "Movement verb with essere." },
  { id: "ho-visto", skill: "Past tense", focus: "verbs", level: 3, it: "ho visto", en: "I saw / I have seen", accepted: ["ho visto"], hint: "Vedere -> visto." },
  { id: "mi-e-piaciuto", skill: "Past tense", focus: "verbs", level: 3, it: "mi è piaciuto", en: "I liked it", accepted: ["mi e piaciuto", "mi è piaciuto"], hint: "Literally it was pleasing to me." },
  { id: "potrei", skill: "Polite forms", focus: "travel", level: 3, it: "potrei avere un tavolo?", en: "could I have a table?", accepted: ["potrei avere un tavolo", "potrei avere un tavolo?"], hint: "Potrei is softer than posso." },
  { id: "vorrei-prenotare", skill: "Polite forms", focus: "travel", level: 3, it: "vorrei prenotare per stasera", en: "I would like to book for tonight", accepted: ["vorrei prenotare per stasera"], hint: "Stasera = this evening." },
  { id: "se-fosse", skill: "Polite forms", focus: "balanced", level: 4, it: "se fosse possibile", en: "if it were possible", accepted: ["se fosse possibile"], hint: "A refined polite phrase." },
  { id: "mi-chiedevo", skill: "Polite forms", focus: "balanced", level: 4, it: "mi chiedevo se...", en: "I was wondering if...", accepted: ["mi chiedevo se"], hint: "Useful for softer requests." },
  { id: "appena-arrivo", skill: "Connectors", focus: "balanced", level: 4, it: "ti scrivo appena arrivo", en: "I'll write to you as soon as I arrive", accepted: ["ti scrivo appena arrivo"], hint: "Appena = as soon as." }
];

const GRAMMAR = [
  { id: "art-il-caffe", skill: "Articles", focus: "grammar", level: 1, prompt: "___ caffè", answer: "il", choices: ["il", "la", "lo", "gli"], explanation: "Caffe is masculine singular, so il caffe." },
  { id: "art-la-stazione", skill: "Articles", focus: "grammar", level: 1, prompt: "___ stazione", answer: "la", choices: ["il", "la", "lo", "i"], explanation: "Stazione is feminine singular, so la stazione." },
  { id: "art-l-aeroporto", skill: "Articles", focus: "grammar", level: 1, prompt: "___ aeroporto", answer: "l'", choices: ["il", "l'", "lo", "la"], explanation: "Before a vowel, the article contracts to l'." },
  { id: "art-gli-studenti", skill: "Articles", focus: "grammar", level: 2, prompt: "___ studenti", answer: "gli", choices: ["i", "gli", "le", "lo"], explanation: "Plural masculine nouns starting with s + consonant use gli." },
  { id: "essere-siamo", skill: "Verbs", focus: "verbs", level: 1, prompt: "Noi ___ italiani.", answer: "siamo", choices: ["sono", "sei", "siamo", "siete"], explanation: "Noi takes siamo." },
  { id: "avere-ho", skill: "Verbs", focus: "verbs", level: 1, prompt: "Io ___ fame.", answer: "ho", choices: ["ho", "hai", "ha", "hanno"], explanation: "Io takes ho." },
  { id: "preposition-al", skill: "Prepositions", focus: "grammar", level: 2, prompt: "Vado ___ mercato.", answer: "al", choices: ["a il", "al", "alla", "allo"], explanation: "A + il contracts to al." },
  { id: "preposition-alla", skill: "Prepositions", focus: "grammar", level: 2, prompt: "Vado ___ stazione.", answer: "alla", choices: ["al", "alla", "allo", "all'"], explanation: "A + la contracts to alla." },
  { id: "agreement-stanca", skill: "Agreement", focus: "grammar", level: 2, prompt: "Maria è molto ___.", answer: "stanca", choices: ["stanco", "stanca", "stanchi", "stanche"], explanation: "Maria is feminine singular, so stanca." },
  { id: "agreement-buoni", skill: "Agreement", focus: "grammar", level: 2, prompt: "I panini sono ___.", answer: "buoni", choices: ["buono", "buona", "buoni", "buone"], explanation: "Panini is masculine plural, so buoni." },
  { id: "past-avere", skill: "Past tense", focus: "verbs", level: 3, prompt: "Ieri ___ mangiato una pizza.", answer: "ho", choices: ["sono", "ho", "hai", "è"], explanation: "Mangiare normally uses avere in the passato prossimo." },
  { id: "past-essere", skill: "Past tense", focus: "verbs", level: 3, prompt: "Ieri ___ andato a Napoli.", answer: "sono", choices: ["ho", "hai", "sono", "abbiamo"], explanation: "Andare uses essere in the passato prossimo." },
  { id: "piacere-singular", skill: "Verbs", focus: "verbs", level: 3, prompt: "Mi ___ questo posto.", answer: "piace", choices: ["piace", "piacciono", "piaci", "piacete"], explanation: "One thing pleases me: mi piace." },
  { id: "piacere-plural", skill: "Verbs", focus: "verbs", level: 3, prompt: "Mi ___ questi posti.", answer: "piacciono", choices: ["piace", "piacciono", "piaci", "piacete"], explanation: "Plural things: mi piacciono." }
];

const ALL_ITEMS = [...COURSE.map((item) => ({ ...item, type: "phrase" })), ...GRAMMAR.map((item) => ({ ...item, type: "choice" }))];

const state = loadState();
const syncRuntime = { busy: false, timer: null };
let activeExercise = null;
let checkedResult = null;

const el = {
  energy: document.querySelector("#energy"),
  minutes: document.querySelector("#minutes"),
  focus: document.querySelector("#focus"),
  energyValue: document.querySelector("#energyValue"),
  todayCount: document.querySelector("#todayCount"),
  masteryScore: document.querySelector("#masteryScore"),
  abilityLane: document.querySelector("#abilityLane"),
  sessionLabel: document.querySelector("#sessionLabel"),
  screenTitle: document.querySelector("#screenTitle"),
  startButton: document.querySelector("#startButton"),
  resetSessionButton: document.querySelector("#resetSessionButton"),
  practicePanel: document.querySelector("#practicePanel"),
  weakSkills: document.querySelector("#weakSkills"),
  nextMix: document.querySelector("#nextMix"),
  recentAnswers: document.querySelector("#recentAnswers"),
  syncStatus: document.querySelector("#syncStatus"),
  syncDetail: document.querySelector("#syncDetail"),
  syncServer: document.querySelector("#syncServer"),
  syncNowButton: document.querySelector("#syncNowButton"),
  syncPullButton: document.querySelector("#syncPullButton")
};

function defaultState() {
  return {
    settings: { energy: 65, minutes: 10, focus: "balanced" },
    progress: {},
    history: [],
    daily: {},
    session: null,
    sync: {
      serverUrl: defaultSyncServerUrl(),
      lastSync: 0,
      status: "Not synced yet",
      detail: "Enter a sync server URL to sync across devices."
    },
    meta: {
      clientId: getClientId(),
      updatedAt: Date.now()
    }
  };
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const base = defaultState();
    if (!parsed) return base;
    return {
      ...base,
      ...parsed,
      settings: { ...base.settings, ...(parsed.settings || {}) },
      sync: { ...base.sync, ...(parsed.sync || {}) },
      meta: { ...base.meta, ...(parsed.meta || {}) }
    };
  } catch {
    return defaultState();
  }
}

function saveState(options = {}) {
  const { touch = true, sync = false } = options;
  if (touch) {
    state.meta = { ...(state.meta || {}), clientId: getClientId(), updatedAt: Date.now() };
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (sync) scheduleSync("change", 900);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function normalize(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, (_, row) => [row]);
  for (let col = 0; col <= a.length; col += 1) matrix[0][col] = col;
  for (let row = 1; row <= b.length; row += 1) {
    for (let col = 1; col <= a.length; col += 1) {
      matrix[row][col] = b[row - 1] === a[col - 1]
        ? matrix[row - 1][col - 1]
        : Math.min(matrix[row - 1][col - 1] + 1, matrix[row][col - 1] + 1, matrix[row - 1][col] + 1);
    }
  }
  return matrix[b.length][a.length];
}

function similarity(a, b) {
  const left = normalize(a);
  const right = normalize(b);
  if (!left || !right) return 0;
  const distance = levenshtein(left, right);
  return 1 - distance / Math.max(left.length, right.length);
}

function progressFor(id) {
  if (!state.progress[id]) {
    state.progress[id] = {
      attempts: 0,
      correct: 0,
      strength: 0,
      due: 0,
      lastGrade: null
    };
  }
  return state.progress[id];
}

function getClientId() {
  let id = localStorage.getItem(CLIENT_ID_KEY);
  if (!id) {
    id = window.crypto?.randomUUID ? crypto.randomUUID() : `client-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(CLIENT_ID_KEY, id);
  }
  return id;
}

function defaultSyncServerUrl() {
  const isHttp = location.protocol === "http:" || location.protocol === "https:";
  const isBundledServer = isHttp && location.port === "4179";
  if (isBundledServer) return location.origin;
  return DEFAULT_SYNC_SERVER;
}

function normalizeServerUrl(value) {
  return String(value || "").trim().replace(/\/+$/, "");
}

function syncServerUrl() {
  state.sync.serverUrl = normalizeServerUrl(state.sync.serverUrl || defaultSyncServerUrl());
  return state.sync.serverUrl;
}

function exportSyncState(source = state) {
  return {
    settings: { ...(source.settings || {}) },
    progress: { ...(source.progress || {}) },
    history: [...(source.history || [])].slice(0, 20),
    daily: { ...(source.daily || {}) },
    meta: { ...(source.meta || {}), clientId: getClientId() }
  };
}

function mergeProgressRow(left = {}, right = {}) {
  return {
    attempts: Math.max(Number(left.attempts) || 0, Number(right.attempts) || 0),
    correct: Math.max(Number(left.correct) || 0, Number(right.correct) || 0),
    strength: Math.max(Number(left.strength) || 0, Number(right.strength) || 0),
    due: Math.max(Number(left.due) || 0, Number(right.due) || 0),
    lastGrade: Number(right.due) >= Number(left.due) ? right.lastGrade || left.lastGrade || null : left.lastGrade || right.lastGrade || null
  };
}

function mergeSyncStates(local = {}, remote = {}) {
  const localUpdated = Number(local?.meta?.updatedAt) || 0;
  const remoteUpdated = Number(remote?.meta?.updatedAt) || 0;
  const merged = {
    settings: remoteUpdated >= localUpdated
      ? { ...(local.settings || {}), ...(remote.settings || {}) }
      : { ...(remote.settings || {}), ...(local.settings || {}) },
    progress: {},
    history: [],
    daily: { ...(local.daily || {}) },
    meta: {
      ...(local.meta || {}),
      ...(remote.meta || {}),
      clientId: getClientId(),
      updatedAt: Math.max(localUpdated, remoteUpdated)
    }
  };

  Object.entries(remote.daily || {}).forEach(([day, count]) => {
    merged.daily[day] = Math.max(Number(merged.daily[day]) || 0, Number(count) || 0);
  });

  new Set([...Object.keys(local.progress || {}), ...Object.keys(remote.progress || {})]).forEach((id) => {
    merged.progress[id] = mergeProgressRow(local.progress?.[id], remote.progress?.[id]);
  });

  const seen = new Set();
  [...(remote.history || []), ...(local.history || [])]
    .filter((row) => row && row.id && row.at)
    .sort((a, b) => Number(b.at) - Number(a.at))
    .forEach((row) => {
      const key = `${row.id}:${row.at}:${row.answer}`;
      if (seen.has(key) || merged.history.length >= 20) return;
      seen.add(key);
      merged.history.push(row);
    });

  return merged;
}

function applySyncState(nextState) {
  state.settings = { ...state.settings, ...(nextState.settings || {}) };
  state.progress = { ...(nextState.progress || {}) };
  state.daily = { ...(nextState.daily || {}) };
  state.history = [...(nextState.history || [])].slice(0, 20);
  state.meta = { ...(state.meta || {}), ...(nextState.meta || {}), clientId: getClientId() };
}

function setSyncStatus(status, detail = "", isError = false) {
  state.sync.status = status;
  state.sync.detail = detail;
  state.sync.lastError = isError ? detail : null;
  if (!isError && status === "Synced") state.sync.lastSync = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  renderSyncPanel();
}

async function fetchSync(path, options = {}) {
  const url = `${syncServerUrl()}${path}`;
  const nativeHttp = window.Capacitor?.getPlatform?.() !== "web"
    ? window.Capacitor?.Plugins?.CapacitorHttp
    : null;

  if (nativeHttp) {
    const response = await nativeHttp.request({
      url,
      method: options.method || "GET",
      headers: {
        "content-type": "application/json",
        ...(options.headers || {})
      },
      data: options.body ? JSON.parse(options.body) : undefined,
      responseType: "json"
    });
    if (response.status < 200 || response.status >= 300) {
      throw new Error(typeof response.data === "string" ? response.data : `HTTP ${response.status}`);
    }
    return typeof response.data === "string" ? JSON.parse(response.data) : response.data;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...(options.headers || {})
    }
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `HTTP ${response.status}`);
  }
  return response.json();
}

async function syncProgress(mode = "both", options = {}) {
  if (syncRuntime.busy) return;
  const serverUrl = syncServerUrl();
  if (!serverUrl) {
    if (!options.silent) setSyncStatus("Sync not configured", "Enter a sync server URL to sync across devices.");
    return;
  }
  syncRuntime.busy = true;
  try {
    setSyncStatus(mode === "pull" ? "Pulling..." : "Syncing...", serverUrl);
    const remotePayload = await fetchSync("/api/progress");
    const remoteState = remotePayload.state || {};
    const merged = mergeSyncStates(exportSyncState(), remoteState);
    if (mode !== "pull") {
      const pushed = await fetchSync("/api/progress", {
        method: "POST",
        body: JSON.stringify({ clientId: getClientId(), state: merged })
      });
      applySyncState(pushed.state || merged);
    } else {
      applySyncState(merged);
    }
    saveState({ touch: false });
    setSyncStatus("Synced", "Last sync just now");
    render();
  } catch (error) {
    const detail = `${serverUrl} · ${error.message}`;
    if (!options.silent) setSyncStatus("Sync failed", detail, true);
    else {
      state.sync.status = "Offline";
      state.sync.detail = detail;
      saveState({ touch: false });
      renderSyncPanel();
    }
  } finally {
    syncRuntime.busy = false;
  }
}

function scheduleSync(reason = "scheduled", delay = 700) {
  window.clearTimeout(syncRuntime.timer);
  syncRuntime.timer = window.setTimeout(() => syncProgress("both", { silent: reason !== "manual" }), delay);
}

function abilityStats() {
  const rows = ALL_ITEMS.map((item) => progressFor(item.id));
  const attempted = rows.filter((row) => row.attempts > 0);
  const avgStrength = attempted.length
    ? attempted.reduce((sum, row) => sum + row.strength, 0) / attempted.length
    : 0;
  const totalAttempts = attempted.reduce((sum, row) => sum + row.attempts, 0);
  const totalCorrect = attempted.reduce((sum, row) => sum + row.correct, 0);
  const accuracy = totalAttempts ? totalCorrect / totalAttempts : 0;
  const mastery = rows.reduce((sum, row) => sum + row.strength, 0) / rows.length;
  const level = avgStrength > 0.68 && accuracy > 0.78 ? "A2+" : avgStrength > 0.42 ? "A2" : avgStrength > 0.18 ? "A1+" : "A1";
  const levelGate = level === "A2+" ? 4 : level === "A2" ? 3 : level === "A1+" ? 2 : 1;
  return { attempted, avgStrength, accuracy, mastery, level, levelGate };
}

function sessionTarget() {
  const minutes = clamp(Number(state.settings.minutes) || 10, 3, 45);
  const energy = clamp(Number(state.settings.energy) || 65, 20, 100);
  const pace = 0.72 + energy / 180;
  return clamp(Math.round(minutes * pace), 4, 34);
}

function eligibleItems() {
  const { levelGate } = abilityStats();
  const energy = Number(state.settings.energy);
  const focus = state.settings.focus;
  const bonus = energy >= 75 ? 1 : 0;
  return ALL_ITEMS.filter((item) => {
    const inLevel = item.level <= levelGate + bonus;
    const inFocus = focus === "balanced" || item.focus === focus || item.focus === "balanced";
    return inLevel && inFocus;
  });
}

function pickSessionItems() {
  const now = Date.now();
  const target = sessionTarget();
  const energy = Number(state.settings.energy);
  const items = eligibleItems();
  const due = items
    .filter((item) => progressFor(item.id).due <= now && progressFor(item.id).attempts > 0)
    .sort((a, b) => progressFor(a.id).strength - progressFor(b.id).strength);
  const weak = items
    .filter((item) => progressFor(item.id).attempts > 0)
    .sort((a, b) => progressFor(a.id).strength - progressFor(b.id).strength)
    .slice(0, Math.ceil(target * 0.35));
  const newLimit = energy >= 80 ? 6 : energy >= 55 ? 4 : 2;
  const fresh = shuffle(items.filter((item) => progressFor(item.id).attempts === 0)).slice(0, newLimit);
  const stretch = energy >= 82
    ? shuffle(ALL_ITEMS.filter((item) => item.level <= abilityStats().levelGate + 2 && item.level > abilityStats().levelGate)).slice(0, 2)
    : [];
  const merged = [];
  [...due, ...weak, ...fresh, ...stretch, ...shuffle(items)].forEach((item) => {
    if (!merged.some((existing) => existing.id === item.id)) merged.push(item);
  });
  return merged.slice(0, target).map((item) => item.id);
}

function makeExercise(item) {
  const progress = progressFor(item.id);
  if (item.type === "choice") {
    return {
      item,
      mode: "choice",
      prompt: item.prompt,
      detail: "Choose the missing Italian form.",
      answer: item.answer,
      choices: shuffle(item.choices),
      explanation: item.explanation,
      tag: item.skill
    };
  }

  const energy = Number(state.settings.energy);
  const recognitionFirst = progress.strength < 0.24 && Math.random() < 0.55;
  const listening = energy > 58 && progress.strength > 0.18 && Math.random() < 0.18 && "speechSynthesis" in window;
  const multipleChoice = recognitionFirst || Math.random() < 0.18;

  if (listening) {
    return {
      item,
      mode: "listen",
      prompt: "Type what you hear",
      detail: item.hint,
      answer: item.it,
      accepted: item.accepted,
      explanation: `${item.it} = ${item.en}`,
      tag: item.skill
    };
  }

  if (multipleChoice) {
    const pool = COURSE.filter((candidate) => candidate.id !== item.id && candidate.skill === item.skill);
    const fallback = COURSE.filter((candidate) => candidate.id !== item.id);
    const options = shuffle([item.en, ...shuffle(pool.length >= 3 ? pool : fallback).slice(0, 3).map((candidate) => candidate.en)]);
    return {
      item,
      mode: "choice",
      prompt: item.it,
      detail: "Pick the meaning.",
      answer: item.en,
      choices: options,
      explanation: item.hint,
      tag: item.skill
    };
  }

  return {
    item,
    mode: "type",
    prompt: `Translate: ${item.en}`,
    detail: item.hint,
    answer: item.it,
    accepted: item.accepted,
    explanation: `${item.it} = ${item.en}`,
    tag: item.skill
  };
}

function checkAnswer(input) {
  if (!activeExercise) return null;
  const raw = String(input || "");
  let correct = false;
  if (activeExercise.mode === "choice") {
    correct = raw === activeExercise.answer;
  } else {
    const accepted = activeExercise.accepted || [activeExercise.answer];
    correct = accepted.some((candidate) => {
      const cleanInput = normalize(raw);
      const cleanCandidate = normalize(candidate);
      if (cleanInput === cleanCandidate) return true;
      return cleanCandidate.length >= 7 && similarity(cleanInput, cleanCandidate) >= 0.87;
    });
  }
  return {
    correct,
    input: raw,
    answer: activeExercise.answer,
    explanation: activeExercise.explanation
  };
}

function gradeToDelta(grade, correct) {
  if (grade === "again") return { strength: -0.18, delay: 8 * 60 * 1000 };
  if (grade === "hard") return { strength: correct ? 0.04 : -0.05, delay: 45 * 60 * 1000 };
  if (grade === "easy") return { strength: 0.18, delay: 34 * 60 * 60 * 1000 };
  return { strength: correct ? 0.11 : 0.01, delay: 9 * 60 * 60 * 1000 };
}

function applyGrade(grade) {
  if (!activeExercise || !checkedResult) return;
  const item = activeExercise.item;
  const progress = progressFor(item.id);
  const delta = gradeToDelta(grade, checkedResult.correct);
  const energyMultiplier = Number(state.settings.energy) >= 80 ? 1.18 : 1;
  progress.attempts += 1;
  progress.correct += checkedResult.correct ? 1 : 0;
  progress.strength = clamp(progress.strength + delta.strength * energyMultiplier, 0, 1);
  progress.due = Date.now() + Math.round(delta.delay * (0.55 + progress.strength));
  progress.lastGrade = grade;

  const day = todayKey();
  state.daily[day] = (state.daily[day] || 0) + 1;
  state.history.unshift({
    id: item.id,
    prompt: activeExercise.prompt,
    answer: checkedResult.answer,
    correct: checkedResult.correct,
    at: Date.now()
  });
  state.history = state.history.slice(0, 12);

  if (state.session) {
    if (checkedResult.correct) state.session.correct += 1;
    state.session.index += 1;
    if (state.session.index >= state.session.queue.length) {
      state.session.finishedAt = Date.now();
    }
  }

  activeExercise = null;
  checkedResult = null;
  saveState({ sync: true });
  render();
}

function startSession() {
  const queue = pickSessionItems();
  state.session = {
    queue,
    index: 0,
    correct: 0,
    startedAt: Date.now(),
    finishedAt: null
  };
  activeExercise = null;
  checkedResult = null;
  saveState();
  render();
}

function endSession() {
  state.session = null;
  activeExercise = null;
  checkedResult = null;
  saveState();
  render();
}

function currentItem() {
  if (!state.session || state.session.finishedAt) return null;
  const id = state.session.queue[state.session.index];
  return ALL_ITEMS.find((item) => item.id === id) || null;
}

function speakItalian(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "it-IT";
  utterance.rate = 0.86;
  window.speechSynthesis.speak(utterance);
}

function render() {
  hydrateControls();
  renderStats();
  renderInsights();
  renderSyncPanel();

  if (!state.session) {
    renderWelcome();
    return;
  }

  if (state.session.finishedAt) {
    renderComplete();
    return;
  }

  const item = currentItem();
  if (!item) {
    renderWelcome();
    return;
  }

  if (!activeExercise || activeExercise.item.id !== item.id) {
    activeExercise = makeExercise(item);
  }
  renderExercise();
}

function hydrateControls() {
  el.energy.value = state.settings.energy;
  el.minutes.value = state.settings.minutes;
  el.focus.value = state.settings.focus;
  el.energyValue.textContent = `${state.settings.energy}%`;
  el.syncServer.value = syncServerUrl();
}

function renderStats() {
  const stats = abilityStats();
  el.todayCount.textContent = state.daily[todayKey()] || 0;
  el.masteryScore.textContent = `${Math.round(stats.mastery * 100)}%`;
  el.abilityLane.textContent = stats.level;
}

function renderInsights() {
  const bySkill = new Map();
  ALL_ITEMS.forEach((item) => {
    const progress = progressFor(item.id);
    const row = bySkill.get(item.skill) || { skill: item.skill, count: 0, strength: 0, attempts: 0 };
    row.count += 1;
    row.strength += progress.strength;
    row.attempts += progress.attempts;
    bySkill.set(item.skill, row);
  });

  const weak = [...bySkill.values()]
    .map((row) => ({ ...row, average: row.strength / row.count }))
    .sort((a, b) => a.average - b.average)
    .slice(0, 4);

  el.weakSkills.innerHTML = weak.map((row) => `
    <div class="skill-row">
      <strong>${row.skill}</strong>
      <small>${Math.round(row.average * 100)}% strength · ${row.attempts} reps</small>
    </div>
  `).join("");

  const mix = pickSessionItems().slice(0, 5).map((id) => ALL_ITEMS.find((item) => item.id === id));
  el.nextMix.innerHTML = mix.map((item) => `
    <div class="mix-row">
      <strong>${item.skill}</strong>
      <small>${item.type === "phrase" ? item.en : item.prompt}</small>
    </div>
  `).join("");

  el.recentAnswers.innerHTML = state.history.length
    ? state.history.slice(0, 5).map((row) => `
      <div class="recent-row">
        <strong>${row.correct ? "Correct" : "Review"} · ${row.answer}</strong>
        <small>${row.prompt}</small>
      </div>
    `).join("")
    : `<div class="recent-row"><strong>No reps yet</strong><small>Start a session and this fills itself in.</small></div>`;
}

function renderSyncPanel() {
  if (!el.syncStatus || !el.syncDetail || !el.syncServer) return;
  el.syncStatus.textContent = state.sync.status || "Not synced yet";
  el.syncDetail.textContent = state.sync.detail || "Enter a sync server URL to sync across devices.";
  if (document.activeElement !== el.syncServer) el.syncServer.value = syncServerUrl();
}

function renderWelcome() {
  const stats = abilityStats();
  const target = sessionTarget();
  el.sessionLabel.textContent = "Ready";
  el.screenTitle.textContent = "Practice that follows your energy";
  el.startButton.textContent = "Start";
  el.resetSessionButton.style.visibility = "hidden";
  el.practicePanel.innerHTML = `
    <div class="welcome-grid">
      <div class="session-card">
        <p class="eyebrow">Today</p>
        <h3>${target} reps · ${state.settings.focus} mix</h3>
        <p>${energyCopy()} Your current lane is ${stats.level}, so the next set will favor level ${stats.levelGate} material with a few carefully chosen stretches.</p>
        <div class="meter" aria-label="Overall mastery"><span style="--value: ${Math.round(stats.mastery * 100)}%"></span></div>
        <button class="primary-button" type="button" data-action="start">Start session</button>
      </div>
      <div class="focus-card">
        <p class="eyebrow">Phrase to keep warm</p>
        <h3>${dailyPhrase().it}</h3>
        <p>${dailyPhrase().en}</p>
        <button class="secondary-button" type="button" data-action="hear-daily">Hear it</button>
      </div>
    </div>
  `;
}

function renderExercise() {
  const session = state.session;
  const total = session.queue.length;
  const number = session.index + 1;
  const progress = Math.round((session.index / total) * 100);
  const isListen = activeExercise.mode === "listen";
  el.sessionLabel.textContent = `${number} of ${total}`;
  el.screenTitle.textContent = activeExercise.tag;
  el.startButton.textContent = "Restart";
  el.resetSessionButton.style.visibility = "visible";

  const answerMarkup = activeExercise.mode === "choice"
    ? `<div class="choice-grid">${activeExercise.choices.map((choice) => `<button class="choice-button" type="button" data-choice="${escapeAttr(choice)}">${choice}</button>`).join("")}</div>`
    : `<form class="answer-form" data-answer-form>
        <input class="answer-input" name="answer" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="Type your answer" />
        <button class="primary-button" type="submit">Check</button>
      </form>`;

  const feedbackMarkup = checkedResult ? renderFeedback() : `
    <div class="feedback">
      <p>${isListen ? "Listen once, then type the Italian." : "Answer first. Grade after checking."}</p>
    </div>
  `;

  el.practicePanel.innerHTML = `
    <article class="practice-card">
      <div class="progress-strip">
        <strong>${number} / ${total}</strong>
        <div class="progress-track" aria-label="Session progress"><span style="--progress: ${progress}%"></span></div>
        <strong>${session.correct} correct</strong>
      </div>
      <div class="question-zone">
        <div class="task-label">
          <span class="tag">${activeExercise.mode}</span>
          <span class="tag hot">${activeExercise.item.skill}</span>
        </div>
        <p class="prompt-text">${activeExercise.prompt}</p>
        <p class="prompt-detail">${activeExercise.detail || ""}</p>
        ${isListen ? `<button class="secondary-button" type="button" data-action="hear-current">Hear</button>` : ""}
        ${checkedResult ? "" : answerMarkup}
      </div>
      ${feedbackMarkup}
    </article>
  `;

  if (isListen && !checkedResult) {
    window.setTimeout(() => speakItalian(activeExercise.item.it), 180);
  }
}

function renderFeedback() {
  const className = checkedResult.correct ? "feedback good" : "feedback miss";
  const lead = checkedResult.correct ? "Yes." : `Answer: ${checkedResult.answer}`;
  return `
    <div class="${className}">
      <p><strong>${lead}</strong> ${checkedResult.explanation || ""}</p>
      <div class="grade-row">
        <button class="grade-button" type="button" data-grade="again">Again</button>
        <button class="grade-button" type="button" data-grade="hard">Hard</button>
        <button class="grade-button" type="button" data-grade="good">Good</button>
        <button class="grade-button" type="button" data-grade="easy">Easy</button>
      </div>
    </div>
  `;
}

function renderComplete() {
  const total = state.session.queue.length;
  const correct = state.session.correct;
  const minutes = Math.max(1, Math.round((state.session.finishedAt - state.session.startedAt) / 60000));
  el.sessionLabel.textContent = "Done";
  el.screenTitle.textContent = "Session complete";
  el.startButton.textContent = "Again";
  el.resetSessionButton.style.visibility = "visible";
  el.practicePanel.innerHTML = `
    <div class="session-complete">
      <p class="eyebrow">Ottimo</p>
      <h3>${correct}/${total} correct in ${minutes} min</h3>
      <div class="complete-stats">
        <div><strong>${state.daily[todayKey()] || 0}</strong><small>reps today</small></div>
        <div><strong>${abilityStats().level}</strong><small>current lane</small></div>
        <div><strong>${Math.round(abilityStats().mastery * 100)}%</strong><small>mastery</small></div>
      </div>
      <button class="primary-button" type="button" data-action="start">Start another</button>
    </div>
  `;
}

function dailyPhrase() {
  const index = new Date().getDate() % COURSE.length;
  return COURSE[index];
}

function energyCopy() {
  const energy = Number(state.settings.energy);
  if (energy >= 82) return "High energy: more new material and harder recall.";
  if (energy >= 55) return "Balanced energy: due items, weak spots, and a few new phrases.";
  return "Low energy: shorter reps and more recognition before recall.";
}

function escapeAttr(value) {
  return String(value).replace(/"/g, "&quot;");
}

el.energy.addEventListener("input", (event) => {
  state.settings.energy = Number(event.target.value);
  saveState({ sync: true });
  render();
});

el.minutes.addEventListener("change", (event) => {
  state.settings.minutes = clamp(Number(event.target.value) || 10, 3, 45);
  saveState({ sync: true });
  render();
});

el.focus.addEventListener("change", (event) => {
  state.settings.focus = event.target.value;
  saveState({ sync: true });
  render();
});

el.startButton.addEventListener("click", startSession);
el.resetSessionButton.addEventListener("click", endSession);
el.syncNowButton.addEventListener("click", () => syncProgress("both"));
el.syncPullButton.addEventListener("click", () => syncProgress("pull"));
el.syncServer.addEventListener("change", (event) => {
  state.sync.serverUrl = normalizeServerUrl(event.target.value);
  saveState({ touch: false });
  if (state.sync.serverUrl) syncProgress("both");
  else setSyncStatus("Sync not configured", "Enter a sync server URL to sync across devices.");
});

el.practicePanel.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]")?.dataset.action;
  const choice = event.target.closest("[data-choice]")?.dataset.choice;
  const grade = event.target.closest("[data-grade]")?.dataset.grade;

  if (action === "start") startSession();
  if (action === "hear-daily") speakItalian(dailyPhrase().it);
  if (action === "hear-current" && activeExercise) speakItalian(activeExercise.item.it);
  if (choice && !checkedResult) {
    checkedResult = checkAnswer(choice);
    renderExercise();
  }
  if (grade) applyGrade(grade);
});

el.practicePanel.addEventListener("submit", (event) => {
  if (!event.target.matches("[data-answer-form]")) return;
  event.preventDefault();
  const input = new FormData(event.target).get("answer");
  checkedResult = checkAnswer(input);
  renderExercise();
});

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

render();
scheduleSync("startup", 600);
window.addEventListener("focus", () => scheduleSync("focus", 300));
window.addEventListener("online", () => scheduleSync("online", 300));
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) scheduleSync("visible", 300);
});
