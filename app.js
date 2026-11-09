"use strict";

// Datos ficticios. La voz se procesa mediante las funciones del navegador.
const notes = [
  { id: "Operaciones", type: "area", text: "Coordinación diaria y seguimiento de actividades." },
  { id: "Proyectos", type: "area", text: "Iniciativas de mejora y ejecución." },
  { id: "Riesgos", type: "area", text: "Identificación y tratamiento de riesgos." },
  { id: "Agenda", type: "agenda", text: "Reunión ficticia: revisión semanal a las nueve." },
  { id: "Clientes", type: "contactos", text: "Directorio de clientes de ejemplo." },
  { id: "Contratos", type: "documentos", text: "Documentos contractuales ficticios." },
  { id: "Incidentes", type: "documentos", text: "Registro simulado de incidencias." },
  { id: "Pendientes", type: "agenda", text: "Revisar propuestas, agenda y seguimiento." },
  { id: "Informes", type: "documentos", text: "Resúmenes ejecutivos de ejemplo." },
  { id: "Equipo", type: "contactos", text: "Organización del equipo ficticio." },
  { id: "Presupuesto", type: "documentos", text: "Datos de muestra, sin cifras reales." },
  { id: "Ideas", type: "area", text: "Posibles iniciativas futuras." }
];

const edges = [
  [0, 1], [0, 2], [0, 3], [0, 7], [0, 8], [0, 9], [1, 5], [1, 7], [1, 10],
  [1, 11], [2, 6], [2, 8], [2, 5], [3, 7], [3, 9], [4, 5], [4, 9], [4, 8],
  [5, 10], [6, 8], [6, 7], [7, 8], [7, 9], [8, 10], [9, 11], [10, 11], [2, 7]
];

const $ = id => document.getElementById(id);
const status = $("status");
const question = $("question");
const micBtn = $("micBtn");
const voiceBtn = $("voiceBtn");
const voiceHint = $("voiceHint");
let currentTab = "chat";

document.querySelectorAll("[data-tab]").forEach(button => {
  button.addEventListener("click", () => {
    currentTab = button.dataset.tab;
    document.querySelectorAll("[data-tab]").forEach(item => item.classList.toggle("active", item === button));
    document.querySelectorAll(".tabpanel").forEach(panel => panel.classList.toggle("hidden", panel.id !== currentTab));
    if (currentTab === "map") drawGraph();
  });
});

const noteList = $("noteList");
notes.forEach(note => {
  const item = document.createElement("div");
  item.className = "note";
  const title = document.createElement("b");
  title.textContent = note.id;
  const text = document.createElement("p");
  text.textContent = note.text;
  item.append(title, text);
  noteList.append(item);
});

function response(input) {
  const normalized = input.toLocaleLowerCase("es");
  if (/hola|buenas|escuchas/.test(normalized)) {
    return "Hola. Te escucho. Soy la demostración de JARVIS y puedo responder en voz alta.";
  }
  if (/parte|hoy|agenda|semana/.test(normalized)) {
    return "Parte de demostración: una reunión ficticia a las nueve y tres pendientes de ejemplo. No estoy leyendo tu calendario.";
  }
  if (/nota|archivo|mapa|documento/.test(normalized)) {
    return "Tengo doce notas ficticias conectadas en el mapa. Abre la pestaña Mapa o Notas para explorarlas.";
  }
  if (/plan|pendiente|prioridad/.test(normalized)) {
    return "Plan simulado: revisar pendientes, confirmar agenda y preparar un informe. No son tareas reales.";
  }
  if (/voz|micrófono|microfono|qué puedes|que puedes|ayuda|funciones/.test(normalized)) {
    return "Puedo escuchar una consulta con el botón MIC, responder en voz alta, mostrar notas ficticias y explorar el mapa. Las respuestas siguen siendo una demostración predefinida.";
  }
  return "Estoy en modo demostración. Puedo escuchar, responder con voz, mostrar el mapa, las notas y un parte ficticio.";
}

function bubble(text, kind) {
  const element = document.createElement("div");
  element.className = `bubble ${kind}`;
  element.textContent = text;
  $("messages").append(element);
  $("messages").scrollTop = $("messages").scrollHeight;
}

const synth = window.speechSynthesis;
const canSpeak = Boolean(synth && window.SpeechSynthesisUtterance);
let voiceEnabled = canSpeak;
let preferredVoice = null;

function selectVoice() {
  if (!canSpeak) return;
  const voices = synth.getVoices();
  if (!voices.length) return;
  const spanish = voices.filter(voice => voice.lang.toLowerCase().startsWith("es"));
  const masculine = /jorge|diego|carlos|andrés|andres|juan|pablo|enrique|sergio|raul|male/i;
  preferredVoice =
    spanish.find(voice => voice.lang.toLowerCase() === "es-cr") ||
    spanish.find(voice => masculine.test(voice.name)) ||
    spanish.find(voice => voice.lang.toLowerCase().startsWith("es-")) ||
    voices[0];
}

if (canSpeak) {
  selectVoice();
  synth.addEventListener?.("voiceschanged", selectVoice);
} else {
  voiceEnabled = false;
  voiceBtn.disabled = true;
  voiceBtn.setAttribute("aria-pressed", "false");
  voiceBtn.textContent = "Voz no disponible";
}

function speak(text) {
  if (!voiceEnabled || !canSpeak) return false;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = preferredVoice?.lang || "es-CR";
  if (preferredVoice) utterance.voice = preferredVoice;
  utterance.rate = 0.95;
  utterance.pitch = 0.88;
  utterance.volume = 1;
  utterance.onstart = () => { status.textContent = "HABLANDO"; };
  utterance.onend = () => { status.textContent = "EN ESPERA"; };
  utterance.onerror = () => { status.textContent = "EN ESPERA"; };
  synth.resume();
  synth.speak(utterance);
  return true;
}

function ask(input) {
  const text = input.trim();
  if (!text) return;
  bubble(text, "user");
  status.textContent = "PROCESANDO DEMO";
  setTimeout(() => {
    const answer = response(text);
    bubble(answer, "bot");
    if (!speak(answer)) status.textContent = "EN ESPERA";
  }, 280);
}

$("chatForm").addEventListener("submit", event => {
  event.preventDefault();
  ask(question.value);
  question.value = "";
});

document.querySelectorAll("[data-q]").forEach(button => {
  button.addEventListener("click", () => ask(button.dataset.q));
});

voiceBtn.addEventListener("click", () => {
  if (!canSpeak) return;
  voiceEnabled = !voiceEnabled;
  voiceBtn.setAttribute("aria-pressed", String(voiceEnabled));
  voiceBtn.textContent = voiceEnabled ? "🔊 Voz activa" : "🔇 Voz apagada";
  if (voiceEnabled) {
    selectVoice();
    synth.resume();
  } else {
    synth.cancel();
    status.textContent = "EN ESPERA";
  }
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let listening = false;

function setListening(active) {
  listening = active;
  micBtn.classList.toggle("listening", active);
  micBtn.setAttribute("aria-pressed", String(active));
  micBtn.innerHTML = active
    ? '<span aria-hidden="true">■</span> PARAR'
    : '<span aria-hidden="true">●</span> MIC';
}

function recognitionErrorMessage(error) {
  if (error === "not-allowed" || error === "service-not-allowed") {
    return "El micrófono está bloqueado. Permite su uso en los ajustes del sitio y vuelve a intentarlo.";
  }
  if (error === "audio-capture") return "No encontré un micrófono disponible.";
  if (error === "no-speech") return "No pude escuchar una frase. Pulsa MIC e inténtalo de nuevo.";
  if (error === "network") return "El reconocimiento de voz necesita conexión en este navegador.";
  if (error === "language-not-supported") return "El navegador no admite el reconocimiento en español.";
  return "No pude iniciar el reconocimiento de voz en este navegador.";
}

function startListening() {
  if (!SpeechRecognition) {
    bubble("Este navegador no ofrece reconocimiento de voz. Puedes usar el dictado del teclado.", "bot");
    voiceHint.textContent = "Prueba Safari o Chrome, o utiliza el dictado del teclado.";
    status.textContent = "MICRÓFONO NO DISPONIBLE";
    return;
  }

  if (canSpeak) synth.cancel();
  let submitted = false;
  recognition = new SpeechRecognition();
  recognition.lang = "es-CR";
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    setListening(true);
    status.textContent = "ESCUCHANDO";
    voiceHint.textContent = "Habla ahora. Pulsa PARAR cuando termines.";
  };

  recognition.onresult = event => {
    let interim = "";
    let finalText = "";
    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      const transcript = event.results[index][0].transcript;
      if (event.results[index].isFinal) finalText += transcript;
      else interim += transcript;
    }
    question.value = (finalText || interim).trim();
    if (finalText.trim() && !submitted) {
      submitted = true;
      const spokenQuestion = finalText.trim();
      recognition.stop();
      question.value = "";
      ask(spokenQuestion);
    }
  };

  recognition.onerror = event => {
    if (event.error !== "aborted") {
      const message = recognitionErrorMessage(event.error);
      bubble(message, "bot");
      voiceHint.textContent = message;
      status.textContent = "ERROR DE MICRÓFONO";
    }
  };

  recognition.onend = () => {
    setListening(false);
    recognition = null;
    voiceHint.textContent = "Pulsa MIC para realizar otra consulta.";
    if (status.textContent === "ESCUCHANDO") status.textContent = "EN ESPERA";
  };

  try {
    recognition.start();
  } catch {
    setListening(false);
    recognition = null;
    bubble("El micrófono aún está ocupado. Espera un momento y vuelve a pulsar MIC.", "bot");
    status.textContent = "EN ESPERA";
  }
}

if (!SpeechRecognition) {
  micBtn.disabled = true;
  voiceHint.textContent = "Reconocimiento no disponible; puedes usar el dictado del teclado.";
}

micBtn.addEventListener("click", () => {
  if (listening && recognition) {
    status.textContent = "DETENIENDO";
    recognition.stop();
    return;
  }
  startListening();
});

const canvas = $("graph");
const ctx = canvas.getContext("2d");
let pos = [];
let selected = -1;
let drag = -1;

function size() {
  const rect = canvas.getBoundingClientRect();
  const density = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(rect.width * density);
  canvas.height = Math.round(rect.height * density);
  ctx.setTransform(density, 0, 0, density, 0, 0);
  const width = rect.width;
  const height = rect.height;
  pos = notes.map((note, index) => ({
    x: width / 2 + Math.cos(index * 2.39996) * Math.sqrt((index + .5) / notes.length) * width * .41,
    y: height / 2 + Math.sin(index * 2.39996) * Math.sqrt((index + .5) / notes.length) * height * .42
  }));
  drawGraph();
}

function drawGraph() {
  if (!pos.length) return;
  const width = canvas.getBoundingClientRect().width;
  const height = canvas.getBoundingClientRect().height;
  ctx.clearRect(0, 0, width, height);
  edges.forEach(([from, to]) => {
    ctx.beginPath();
    ctx.moveTo(pos[from].x, pos[from].y);
    ctx.lineTo(pos[to].x, pos[to].y);
    ctx.strokeStyle = selected === from || selected === to ? "#66d6e0" : "#25465a";
    ctx.lineWidth = selected === from || selected === to ? 1.8 : .8;
    ctx.stroke();
  });
  pos.forEach((point, index) => {
    const degree = edges.filter(edge => edge.includes(index)).length;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 3 + degree * .65, 0, Math.PI * 2);
    ctx.fillStyle = index === selected ? "#e0ffff" : notes[index].type === "area" ? "#65c7d2" : notes[index].type === "agenda" ? "#ad9d79" : "#6c91ad";
    ctx.fill();
    ctx.font = "10px -apple-system, sans-serif";
    ctx.fillStyle = index === selected ? "#fff" : "#94aebd";
    ctx.textAlign = "center";
    ctx.fillText(notes[index].id, point.x, point.y - 12);
  });
}

function hit(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return pos.findIndex(point => Math.hypot(point.x - x, point.y - y) < 18);
}

canvas.addEventListener("pointerdown", event => {
  drag = hit(event);
  if (drag >= 0) {
    canvas.setPointerCapture(event.pointerId);
    selected = drag;
    $("selected").textContent = `${notes[drag].id} — ${notes[drag].text}`;
    drawGraph();
  }
});

canvas.addEventListener("pointermove", event => {
  if (drag < 0) return;
  const rect = canvas.getBoundingClientRect();
  pos[drag] = { x: event.clientX - rect.left, y: event.clientY - rect.top };
  drawGraph();
});
canvas.addEventListener("pointerup", () => { drag = -1; });
canvas.addEventListener("pointercancel", () => { drag = -1; });
window.addEventListener("resize", size);
size();

if ("serviceWorker" in navigator && location.protocol === "https:") {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
