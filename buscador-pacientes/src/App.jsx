import React, { useState, useMemo, useEffect } from "react";
import {
  Search, AlertTriangle, Upload, ListChecks, ShieldAlert, Plus, Trash2, Info,
  ExternalLink, Camera, FileText, Loader2, X, MapPin,
} from "lucide-react";

// ---------- helpers ----------
const stripAccents = (s = "") => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const normName = (s = "") => stripAccents(s).toLowerCase().replace(/[^a-z\s]/g, "").trim().replace(/\s+/g, " ");
const normCedula = (s = "") => (s || "").replace(/[^\d]/g, "");
const fmtCedula = (c) => (c ? c.replace(/(\d)(?=(\d{3})+$)/g, "$1.") : "—");

let idCounter = 1;
const nextId = () => idCounter++;
const mk = (nombre, cedula, edad, hospital, fuente, notas, estado) => ({
  id: nextId(), nombre, cedula: cedula || "", edad: edad || "", hospital, fuente, notas: notas || "", estado: estado || "",
});

const allSeed = [];


const alertasFuentes = [
  { titulo: "Hospital periférico de Catia (lista fechada 11/06)", detalle: "La imagen trae fecha 11/06, no 24/06 (fecha del sismo). No la incorporé. Confirmar si es error de transcripción o de otro evento antes de usarla." },
  { titulo: "Hospital Médico-Quirúrgico Dr. Ricardo Baquero González", detalle: "Ese nombre coincide con un hospital público en Bogotá, Colombia, no en Venezuela. No la incorporé — verificar el origen real de la foto." },
  { titulo: "Hospital El Llanito (lista manuscrita, solo nombres)", detalle: "Probablemente el mismo centro que 'Dr. Domingo Luciani (El Llanito)', pero sin cédulas — solo se puede cruzar por nombre, no con certeza." },
  { titulo: "Ana Francisca Pérez de León 2 / lista pediátrica / cirugía-trauma", detalle: "Tienen datos útiles pero no las precargué por el volumen de transcripción manual. Súbelas con foto o texto desde 'Agregar' y revisa la vista previa." },
  { titulo: "Recurso ya existente", detalle: "Ya circula 'Desaparecidos Terremoto Venezuela', citado en CNN, hecho justo para esto. Revisa la pestaña 'Otros sitios'." },
];

const sitiosExternos = [
  { nombre: "Desaparecidos Terremoto Venezuela", url: "https://desaparecidosterremotovenezuela.com", desc: "El citado en prensa (CNN). Reportas a alguien con quien no logras contactar, o avisas cuando lo encuentres." },
  { nombre: "Venezuela Reporta", url: "https://venezuelareporta.org", desc: "Registro comunitario grande con foto de cada persona buscada y filtro por nombre/zona. Info sin verificar." },
  { nombre: "Venezuela Te Busca", url: "https://venezuelatebusca.com", desc: "Registrar y marcar personas como 'encontradas'. Más simple, sin fotos por defecto." },
  { nombre: "Ayuda Venezuela", url: "https://ayudavenezuela.app", desc: "Refugios, hospitales, donación de sangre, daños estructurales y guía para venezolanos en el exterior." },
  { nombre: "SismoVenezuela", url: "https://www.sismovenezuela.com", desc: "Mapa que consolida reportes de YouTube, X e Instagram en tiempo real. Proyecto abierto." },
  { nombre: "Mapa de Daños Venezuela", url: "https://terremotovenezuela.com", desc: "Mapa de edificios afectados por dirección/zona, más enfocado en infraestructura." },
  { nombre: "Mapa de Emergencia y Rescate", url: "https://terremotovenezuela.app", desc: "Reporte ciudadano por colores y directorio de teléfonos de bomberos/ambulancias de Caracas." },
  { nombre: "Ayuda Terremoto Venezuela", url: "https://www.ayudasismo.org", desc: "Pensado para coordinadores: reporta necesidades (refugio, comida, equipos médicos) y prioriza casos." },
];

// Cambia este PIN por uno que solo tú conozcas
const CONFLICTS_PIN = "1234";

// ---------- parser texto ----------
function parseLines(text, hospital, fuente) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  return lines.map((line) => {
    let clean = line.replace(/^[-•\d.]+\s*/, "");
    let cedula = "", edad = "", notas = "";
    const cedMatch = clean.match(/(\d{1,3}(?:[.\s]\d{3}){1,3}|\d{6,9})/);
    const sinCed = /sin\s*c[eé]dula/i.test(clean);
    const edadMatch = clean.match(/(\d{1,3})\s*a[ñn]os/i);
    if (edadMatch) edad = edadMatch[1] + " años";
    if (cedMatch && !edadMatch) cedula = cedMatch[1];
    if (sinCed) notas = "Sin cédula (según fuente)";
    let nombre = clean
      .replace(/[-–—]?\s*(?:C\.?I\.?\s*)?\d{1,3}(?:[.\s]\d{3}){1,3}.*$/, "")
      .replace(/[-–—]?\s*\d{6,9}.*$/, "")
      .replace(/[-–—]?\s*\d{1,3}\s*a[ñn]os.*$/i, "")
      .replace(/[-–—]?\s*sin\s*c[eé]dula.*$/i, "")
      .trim();
    if (!nombre) nombre = clean;
    return mk(nombre, cedula, edad, hospital, fuente, notas);
  });
}

// ---------- lectura de fotos con IA ----------
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result.split(",")[1]);
    r.onerror = reject;
    r.readAsDataURL(file);
  });

async function readListFromImage(file) {
  const base64 = await fileToBase64(file);
  const prompt =
    "Esta imagen es una lista de pacientes o heridos de un hospital en Venezuela tras un terremoto. " +
    "Transcribe cada persona como un objeto JSON con las claves nombre, cedula, edad, notas (todo como texto, usa \"\" si no aplica). " +
    "Si en vez de cédula ves una edad, ponla en edad como '24 años' y deja cedula vacío. " +
    "Si dice 'sin cédula', deja cedula vacío y pon 'Sin cédula' en notas. " +
    "Si hay alguna anotación de estado (quirófano, medicina, alta, fallecido, etc.) pásala tal cual a notas. " +
    "Responde ÚNICAMENTE con un array JSON válido, sin texto adicional.";

  const apiKey = import.meta.env.VITE_ANTHROPIC_KEY || "";
  if (!apiKey) throw new Error("Falta VITE_ANTHROPIC_KEY en el archivo .env");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: file.type || "image/jpeg", data: base64 } },
          { type: "text", text: prompt },
        ],
      }],
    }),
  });
  const data = await response.json();
  const textBlock = (data.content || []).find((b) => b.type === "text");
  if (!textBlock) throw new Error("La IA no devolvió texto legible.");
  const clean = textBlock.text.replace(/```json|```/g, "").trim();
  const arr = JSON.parse(clean);
  if (!Array.isArray(arr)) throw new Error("La IA no devolvió una lista.");
  return arr;
}

// ============================================================================
export default function App() {
  const [records, setRecords] = useState(allSeed);
  const [query, setQuery] = useState("");
  const [hospitalFilter, setHospitalFilter] = useState("Todos");
  const [section, setSection] = useState("agregar");

  const [impHospital, setImpHospital] = useState("");
  const [impFuente, setImpFuente] = useState("");
  const [impText, setImpText] = useState("");
  const [impMethod, setImpMethod] = useState("foto");
  const [preview, setPreview] = useState(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiError, setAiError] = useState("");
  const [imgPreviewUrl, setImgPreviewUrl] = useState(null);

  const [conflictsUnlocked, setConflictsUnlocked] = useState(false);
  const [conflictsPinInput, setConflictsPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  useEffect(() => {
    try {
      const saved = localStorage.getItem("registros-extra");
      if (saved) {
        const extra = JSON.parse(saved);
        if (Array.isArray(extra) && extra.length) {
          setRecords((prev) => {
            const ids = new Set(prev.map((p) => p.id));
            return [...prev, ...extra.filter((e) => !ids.has(e.id))];
          });
        }
      }
    } catch (e) {}
  }, []);

  const persistExtra = (newOnes) => {
    try {
      const saved = localStorage.getItem("registros-extra");
      const prev = saved ? JSON.parse(saved) : [];
      localStorage.setItem("registros-extra", JSON.stringify([...prev, ...newOnes]));
    } catch (e) {}
  };

  const todosHospitales = useMemo(() => ["Todos", ...new Set(records.map((r) => r.hospital))], [records]);

  // Reset page when search changes
  useEffect(() => { setPage(1); }, [query, hospitalFilter]);

  const filtered = useMemo(() => {
    const q = normName(query);
    return records.filter((r) => {
      const matchHosp = hospitalFilter === "Todos" || r.hospital === hospitalFilter;
      if (!q) return matchHosp;
      const nameHit = normName(r.nombre).includes(q);
      const cedHit = normCedula(r.cedula).includes(normCedula(query));
      return matchHosp && (nameHit || (query.replace(/\D/g, "").length >= 3 && cedHit));
    });
  }, [records, query, hospitalFilter]);

  const conflicts = useMemo(() => {
    const byCedula = {}, byName = {};
    records.forEach((r) => {
      const c = normCedula(r.cedula), n = normName(r.nombre);
      if (c) (byCedula[c] = byCedula[c] || []).push(r);
      if (n) (byName[n] = byName[n] || []).push(r);
    });
    const cedulaConflicts = Object.entries(byCedula)
      .map(([ced, rows]) => ({ ced, rows, names: new Set(rows.map((r) => normName(r.nombre))) }))
      .filter((g) => g.names.size > 1);
    const nameConflicts = Object.entries(byName)
      .map(([nom, rows]) => ({ nom, rows, cedulas: new Set(rows.map((r) => normCedula(r.cedula)).filter(Boolean)) }))
      .filter((g) => g.cedulas.size > 1);
    return { cedulaConflicts, nameConflicts };
  }, [records]);

  const totalConflicts = conflicts.cedulaConflicts.length + conflicts.nameConflicts.length;

  const handlePreviewText = () => {
    if (!impText.trim() || !impHospital.trim()) return;
    setPreview(parseLines(impText, impHospital.trim(), impFuente.trim() || "Importado manualmente (texto)"));
  };

  const handleImageUpload = async (file) => {
    if (!file || !impHospital.trim()) { setAiError("Primero escribe el nombre del hospital arriba."); return; }
    setAiBusy(true); setAiError(""); setImgPreviewUrl(URL.createObjectURL(file));
    try {
      const arr = await readListFromImage(file);
      setPreview(arr.map((p) => mk(p.nombre || "(sin nombre)", normCedula(p.cedula), p.edad || "", impHospital.trim(), impFuente.trim() || "Foto leída por IA", p.notas || "")));
    } catch (e) {
      setAiError("No se pudo leer la imagen automáticamente (" + e.message + "). Puedes transcribirla a mano en 'Pegar texto'.");
    } finally { setAiBusy(false); }
  };

  const handleConfirmImport = () => {
    if (!preview) return;
    setRecords((prev) => [...prev, ...preview]);
    persistExtra(preview);
    setPreview(null); setImpText(""); setImgPreviewUrl(null);
  };

  const tryPin = () => {
    if (conflictsPinInput === CONFLICTS_PIN) {
      setConflictsUnlocked(true); setConflictsPinInput(""); setPinError(false);
    } else {
      setConflictsPinInput(""); setPinError(true);
    }
  };

  const removeFromPreview = (id) => setPreview((prev) => prev.filter((p) => p.id !== id));
  const removeRecord = (id) => setRecords((prev) => prev.filter((r) => r.id !== id));

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans">
      <div className="h-1.5 flex">
        <div className="flex-1" style={{ backgroundColor: "#FCD34D" }} />
        <div className="flex-1" style={{ backgroundColor: "#2563EB" }} />
        <div className="flex-1" style={{ backgroundColor: "#DC2626" }} />
      </div>

      <nav className="sticky top-0 z-20 bg-[#0b0d12] text-white px-4 sm:px-8 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-lg">🇻🇪</span>
          <span className="font-bold text-sm sm:text-base">Buscador de Pacientes</span>
        </div>
        <span className="text-[11px] font-mono text-slate-400 hidden sm:block">Sismo 24/06/2026</span>
      </nav>

      <header className="bg-gradient-to-b from-[#0b0d12] to-[#3b0a0a] text-white px-4 sm:px-8 pt-8 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight">¿Dónde está internado tu familiar?</h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Busca por nombre o cédula y cruzamos los datos entre varias listas de hospitales para ayudarte a confirmar dónde está.
          </p>
          <div className="flex justify-center gap-3 sm:gap-6 mt-6 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-mono font-bold">{records.length}</p>
              <p className="text-[11px] uppercase tracking-wide text-slate-400">registros</p>
            </div>
            <div className="w-px bg-slate-700" />
            <div>
              <p className="text-2xl sm:text-3xl font-mono font-bold">{todosHospitales.length - 1}</p>
              <p className="text-[11px] uppercase tracking-wide text-slate-400">hospitales</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-8 -mt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nombre, apellido o cédula…"
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-300 text-base focus:outline-none focus:ring-2 focus:ring-red-600"
                autoFocus
              />
            </div>
            <select
              value={hospitalFilter}
              onChange={(e) => setHospitalFilter(e.target.value)}
              className="px-3 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 bg-white"
            >
              {todosHospitales.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
        </div>

        {(query || hospitalFilter !== "Todos") && (() => {
          const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
          const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
          return (
            <div className="mt-3 mb-4">
              <p className="text-xs text-slate-500 px-1 mb-2">
                {filtered.length} resultado(s){filtered.length > PAGE_SIZE ? ` · página ${page} de ${totalPages}` : ""}
              </p>
              <div className="space-y-2">
                {paginated.map((r) => (
                  <div key={r.id} className="bg-white rounded-xl border border-slate-200 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm flex items-center gap-2 flex-wrap">
                          {r.nombre}
                          {r.estado && (
                            <span className={`inline-flex items-center text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                              /defunci|fallec/i.test(r.estado) ? "bg-red-100 text-red-700" : /alta/i.test(r.estado) ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                            }`}>{r.estado}</span>
                          )}
                        </p>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin size={11} /> {r.hospital}
                          {r.edad && <span className="ml-2">· {r.edad}</span>}
                        </p>
                      </div>
                      <div className="text-right shrink-0 flex items-center gap-3">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Cédula</p>
                          <p className="font-mono text-sm font-semibold">{fmtCedula(r.cedula) !== "—" ? fmtCedula(r.cedula) : "—"}</p>
                        </div>
                        <button onClick={() => removeRecord(r.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={13} /></button>
                      </div>
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="text-center py-10 text-slate-400 text-sm bg-white rounded-xl border border-slate-200">
                    No hay coincidencias con ese filtro.
                  </div>
                )}
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 mt-4">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 rounded-lg text-sm border border-slate-200 text-slate-500 disabled:opacity-30 hover:bg-slate-100"
                  >‹</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`px-3 py-1.5 rounded-lg text-sm border ${n === page ? "bg-slate-900 text-white border-slate-900" : "border-slate-200 text-slate-600 hover:bg-slate-100"}`}
                    >{n}</button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 rounded-lg text-sm border border-slate-200 text-slate-500 disabled:opacity-30 hover:bg-slate-100"
                  >›</button>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-8 pb-10 mt-4">
        <div className="flex gap-1 border-b border-slate-300 overflow-x-auto mb-5">
          {[
            { id: "agregar", label: "Agregar lista", icon: Upload },
            { id: "conflictos", label: "Conflictos", icon: AlertTriangle },
            { id: "alertas", label: "Fuentes y alertas", icon: ShieldAlert },
            { id: "sitios", label: "Otros sitios", icon: ExternalLink },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setSection(t.id)}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                section === t.id ? "border-red-600 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <t.icon size={15} /> {t.label}
            </button>
          ))}
        </div>

        {/* ── AGREGAR ── */}
        {section === "agregar" && (
          <div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 text-sm text-blue-900 flex gap-2">
              <Info size={16} className="shrink-0 mt-0.5" />
              <p>Primero indica el hospital, después sube la foto o pega el texto. Siempre revisa la vista previa antes de confirmar.</p>
            </div>
            <div className="space-y-3 max-w-xl">
              <div>
                <label className="text-xs font-semibold text-slate-600">Hospital</label>
                <input value={impHospital} onChange={(e) => setImpHospital(e.target.value)}
                  placeholder="Ej: Ana Francisca Pérez de León 2"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-300 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Fuente / cómo llegó esta lista</label>
                <input value={impFuente} onChange={(e) => setImpFuente(e.target.value)}
                  placeholder="Ej: Foto del cartel en pared, grupo de WhatsApp X"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-300 text-sm" />
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={() => setImpMethod("foto")} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border ${impMethod === "foto" ? "bg-slate-900 text-white border-slate-900" : "border-slate-300 text-slate-600"}`}>
                  <Camera size={15} /> Subir foto
                </button>
                <button onClick={() => setImpMethod("texto")} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border ${impMethod === "texto" ? "bg-slate-900 text-white border-slate-900" : "border-slate-300 text-slate-600"}`}>
                  <FileText size={15} /> Pegar texto
                </button>
              </div>
              {impMethod === "foto" && (
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-5 text-center">
                  {imgPreviewUrl && <img src={imgPreviewUrl} alt="" className="max-h-40 mx-auto rounded-lg mb-3 object-contain" />}
                  <input type="file" accept="image/*" id="fotoInput" className="hidden"
                    onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])} />
                  <label htmlFor="fotoInput" className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer hover:bg-red-700">
                    {aiBusy ? <Loader2 size={15} className="animate-spin" /> : <Camera size={15} />}
                    {aiBusy ? "Leyendo la imagen…" : "Elegir foto de la lista"}
                  </label>
                  <p className="text-xs text-slate-400 mt-2">La IA transcribe nombre, cédula/edad y notas. Listas muy largas conviene partirlas en 2-3 fotos.</p>
                  {aiError && <p className="text-xs text-red-600 mt-2">{aiError}</p>}
                </div>
              )}
              {impMethod === "texto" && (
                <div>
                  <textarea value={impText} onChange={(e) => setImpText(e.target.value)} rows={7}
                    placeholder={"Nombre Apellido - 12.345.678\nOtro Nombre - 14 años\nFulano de Tal - Sin cédula"}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono" />
                  <button onClick={handlePreviewText} className="mt-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-800">
                    <ListChecks size={15} /> Ver vista previa
                  </button>
                </div>
              )}
            </div>
            {preview && (
              <div className="mt-5 max-w-xl">
                <p className="text-sm font-semibold mb-2">Vista previa ({preview.length} registros) — revisa antes de confirmar</p>
                <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-72 overflow-y-auto bg-white">
                  {preview.map((p) => (
                    <div key={p.id} className="px-3 py-2 text-xs flex justify-between gap-2 items-center">
                      <span><span className="font-medium">{p.nombre}</span>{p.notas && <span className="text-amber-700"> · {p.notas}</span>}</span>
                      <span className="flex items-center gap-2 shrink-0">
                        <span className="font-mono text-slate-500">{p.cedula || p.edad || "—"}</span>
                        <button onClick={() => removeFromPreview(p.id)} className="text-slate-300 hover:text-red-500"><X size={13} /></button>
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={handleConfirmImport} className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-emerald-800">
                    <Plus size={15} /> Confirmar e incorporar
                  </button>
                  <button onClick={() => setPreview(null)} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-200">Descartar</button>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">Esto se guarda solo en tu navegador, no es público.</p>
              </div>
            )}
          </div>
        )}

        {/* ── CONFLICTOS (PRIVADO) ── */}
        {section === "conflictos" && (
          <>
            {!conflictsUnlocked ? (
              <div className="max-w-xs mx-auto mt-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-center space-y-4">
                <ShieldAlert size={32} className="text-amber-500 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">Sección privada</p>
                <p className="text-xs text-slate-500">
                  Esta sección contiene inconsistencias entre fuentes que aún no han sido verificadas y no es adecuada para el público general.
                </p>
                <input
                  type="password"
                  value={conflictsPinInput}
                  onChange={(e) => { setConflictsPinInput(e.target.value); setPinError(false); }}
                  onKeyDown={(e) => e.key === "Enter" && tryPin()}
                  placeholder="PIN de acceso"
                  className={`w-full px-3 py-2 rounded-lg border text-sm text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-red-600 ${pinError ? "border-red-400 bg-red-50" : "border-slate-300"}`}
                  autoFocus
                />
                {pinError && <p className="text-xs text-red-600 -mt-2">PIN incorrecto, intenta de nuevo.</p>}
                <button onClick={tryPin} className="w-full bg-slate-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-800">
                  Entrar
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-slate-600">
                    No siempre es un error — puede ser una transcripción distinta de la misma persona, o dos personas distintas con datos parecidos. Confirmar a mano antes de informar.
                  </p>
                  <button onClick={() => setConflictsUnlocked(false)} className="text-xs text-slate-400 hover:text-slate-600 shrink-0 whitespace-nowrap">
                    Cerrar sesión
                  </button>
                </div>
                <p className="text-xs text-slate-500">{totalConflicts} grupo(s) por revisar</p>
                {totalConflicts === 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800">
                    No se detectaron inconsistencias en los datos cargados actualmente.
                  </div>
                )}
                {conflicts.cedulaConflicts.map((g) => (
                  <div key={g.ced} className="bg-white border border-red-200 rounded-xl p-4">
                    <p className="text-xs font-semibold text-red-700 uppercase mb-2">Misma cédula, nombres distintos — {fmtCedula(g.ced)}</p>
                    {g.rows.map((r) => (
                      <p key={r.id} className="text-sm">
                        <span className="font-medium">{r.nombre}</span>{" "}
                        <span className="text-slate-400 text-xs">({r.hospital} · {r.fuente})</span>
                      </p>
                    ))}
                  </div>
                ))}
                {conflicts.nameConflicts.map((g) => (
                  <div key={g.nom} className="bg-white border border-amber-200 rounded-xl p-4">
                    <p className="text-xs font-semibold text-amber-700 uppercase mb-2">Mismo nombre, cédulas distintas</p>
                    {g.rows.map((r) => (
                      <p key={r.id} className="text-sm">
                        <span className="font-medium">{r.nombre}</span>{" "}
                        <span className="font-mono text-slate-600">{r.cedula}</span>{" "}
                        <span className="text-slate-400 text-xs">({r.hospital} · {r.fuente})</span>
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── ALERTAS ── */}
        {section === "alertas" && (
          <div className="space-y-3">
            {alertasFuentes.map((a, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-4">
                <p className="text-sm font-semibold flex items-center gap-2"><ShieldAlert size={15} className="text-amber-600 shrink-0" /> {a.titulo}</p>
                <p className="text-sm text-slate-600 mt-1">{a.detalle}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── SITIOS ── */}
        {section === "sitios" && (
          <div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-sm text-amber-900 flex gap-2">
              <Info size={16} className="shrink-0 mt-0.5" />
              <p>Iniciativas ciudadanas reales sobre este terremoto. Ninguna verifica lo que reciben — nunca den dinero a cambio de información sobre una persona.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {sitiosExternos.map((s) => (
                <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer"
                  className="block bg-white border border-slate-200 rounded-xl p-4 hover:border-red-300 hover:shadow-sm transition-all">
                  <p className="text-sm font-semibold flex items-center gap-1.5">{s.nombre} <ExternalLink size={13} className="text-slate-400" /></p>
                  <p className="text-xs text-slate-500 mt-1 font-mono">{s.url.replace("https://", "")}</p>
                  <p className="text-sm text-slate-600 mt-2">{s.desc}</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="max-w-3xl mx-auto px-4 sm:px-8 pb-8 text-xs text-slate-400">
        Herramienta de apoyo para ubicar a familiares. No sustituye la confirmación oficial de un hospital, Cruz Roja o Protección Civil.
      </footer>
    </div>
  );
}
