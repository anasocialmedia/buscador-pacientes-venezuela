import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Search, ExternalLink, MapPin, ChevronLeft, ChevronRight, Plus, CheckCircle, AlertCircle, X, Copy, Mic, MicOff, UserX } from "lucide-react";

// ---------- helpers ----------
const stripAccents = (s = "") => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const phoneticNorm = (w = "") =>
  stripAccents(w).toLowerCase()
    .replace(/ph/g, "f").replace(/th/g, "t")
    .replace(/z/g, "s").replace(/v/g, "b")
    .replace(/y/g, "i").replace(/ll/g, "i")
    .replace(/h/g, "").replace(/(.)\1+/g, "$1")
    .replace(/[^a-z0-9]/g, "");

const normCedula = (s = "") => (s || "").replace(/[^\d]/g, "");
const fmtCedula = (c) => (c ? c.replace(/(\d)(?=(\d{3})+$)/g, "$1.") : "—");

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}

// Improved search: no false positives from stopwords/single-char tokens
function fuzzyMatch(query, target) {
  if (!query) return false;
  const qClean = stripAccents(query).toLowerCase().trim();
  const tClean = stripAccents(target).toLowerCase().trim();

  // 1. Direct substring (fastest, no phonetic distortion)
  if (tClean.includes(qClean)) return true;

  // 2. Word-level — filter stopwords (≤ 2 chars)
  const qWords = qClean.split(/\s+/).filter(w => w.length >= 3);
  const tWords = tClean.split(/\s+/).filter(w => w.length >= 3);
  if (!qWords.length || !tWords.length) return false;

  return qWords.every(qw => {
    const qwP = phoneticNorm(qw);
    return tWords.some(tw => {
      const twP = phoneticNorm(tw);
      // Prefix: "sofi" matches "sofia"
      if (twP.startsWith(qwP) || qwP.startsWith(twP)) return true;
      // Phonetic contains
      if (twP.includes(qwP)) return true;
      // Fuzzy distance — only for words ≥ 4 chars each, max 1 error per 4 chars
      if (qwP.length >= 4 && twP.length >= 4) {
        const maxLen = Math.max(qwP.length, twP.length);
        return levenshtein(qwP, twP) <= Math.max(1, Math.floor(maxLen / 4));
      }
      return false;
    });
  });
}

// Parser for community submissions
function parseSubmission(text, hospital) {
  return text.split("\n").map(l => l.trim()).filter(Boolean).map(line => {
    const parts = line.split(/[-–,|]/);
    const nombre = stripAccents(parts[0] || "").trim();
    const cedula = normCedula(parts[1] || "");
    const edad = (parts[2] || "").trim();
    return { nombre, cedula, edad, hospital };
  }).filter(p => p.nombre.length > 1);
}

let idCounter = 1;
const nextId = () => idCounter++;
const mk = (nombre, cedula, edad, hospital, fuente, notas, estado) => ({
  id: nextId(), nombre, cedula: cedula || "", edad: edad || "",
  hospital, fuente, notas: notas || "", estado: estado || "",
});

// ── DATOS ── Clínica El Ávila (fuente: listado físico 26/06/2026)
const H_AVILA = "Clínica El Ávila";
const pacientes = [
  // Items 1-25
  mk("Dorys Zorrilo", "", "38 años", H_AVILA, "Listado físico El Ávila", "Dx: Tx musculoesquelético"),
  mk("Rosalinda Fernández", "", "28 años", H_AVILA, "Listado físico El Ávila", "Dx: Tx musculoesquelético / politraumatismo"),
  mk("Alejandro Tovar", "", "26 años", H_AVILA, "Listado físico El Ávila", "Dx: Politraumatismo"),
  mk("Juchi Feng", "", "53 años", H_AVILA, "Listado físico El Ávila", "Dx: Polit / hemotórax D / Tx abd"),
  mk("Sofia Bolgnese", "", "20 años", H_AVILA, "Listado físico El Ávila", "Dx: Tx musculoesquelético cerrado"),
  mk("Yuriman Millán", "", "29 años", H_AVILA, "Listado físico El Ávila", "Dx: Tx musculoesquelético"),
  mk("Cim Berk Arisoy", "", "33 años", H_AVILA, "Listado físico El Ávila", "Dx: Fractura de tobillo"),
  mk("Juan Carlos González", "", "", H_AVILA, "Listado físico El Ávila", "Dx: Polit"),
  mk("Greisy González", "", "20 años", H_AVILA, "Listado físico El Ávila", ""),
  mk("Juan Rodriguez", "", "16 años", H_AVILA, "Listado físico El Ávila", "Asmático"),
  mk("Grecia González", "", "36 años", H_AVILA, "Listado físico El Ávila", "Dx: Tx musculoesquelético"),
  mk("Miguel Rodriguez", "", "38 años", H_AVILA, "Listado físico El Ávila", "Dx: Tx musculoesquelético"),
  mk("Furgencia Millán", "", "58 años", H_AVILA, "Listado físico El Ávila", "Diabético · Dx: Tx musculoesquelético"),
  mk("Sonia Feng", "", "20 años", H_AVILA, "Listado físico El Ávila", "Dx: Tx musculoesquelético"),
  mk("Moraima González", "", "65 años", H_AVILA, "Listado físico El Ávila", "Espondioloartritis · Dx: Tx craneoencefálico / herida"),
  mk("Frenesi Bemítez", "", "31 años", H_AVILA, "Listado físico El Ávila", "Dx: Tx craneoencefálico"),
  mk("Hasem Salah", "", "62 años", H_AVILA, "Listado físico El Ávila", "Dx: Tx craneoencefálico"),
  mk("Bruno Romero", "", "87 años", H_AVILA, "Listado físico El Ávila", "Dx: Polit"),
  mk("Ricardo Bodul", "", "63 años", H_AVILA, "Listado físico El Ávila", ""),
  mk("Victoria Delgado", "", "19 años", H_AVILA, "Listado físico El Ávila", ""),
  mk("Johani Aguilar", "", "43 años", H_AVILA, "Listado físico El Ávila", ""),
  mk("Nicollete Nuovo", "", "77 años", H_AVILA, "Listado físico El Ávila", "Dx: Fractura pelvis / Fx astrágalo"),
  mk("José Luis Costa", "", "", H_AVILA, "Listado físico El Ávila", ""),
  mk("Bárbara Morillo", "", "menor", H_AVILA, "Listado físico El Ávila", "Dx: Polit región / Tx rodilla"),
  mk("Ana Ialongo", "", "86 años", H_AVILA, "Listado físico El Ávila", "Alergia: mariscos/aspirina · Dx: Traumatismo contuso"),
  // Items 26-51
  mk("Marbelis Gino", "", "28 años", H_AVILA, "Listado físico El Ávila", "Dx: HTA / ansiedad"),
  mk("Erik Monterey Santo", "", "52 años", H_AVILA, "Listado físico El Ávila", ""),
  mk("Maribel Aguilera", "", "32 años", H_AVILA, "Listado físico El Ávila", "Sx convulsivo"),
  mk("Gabriel González", "", "82 años", H_AVILA, "Listado físico El Ávila", "Dx: Esguince tobillo izquierdo"),
  mk("Yoani González", "", "58 años", H_AVILA, "Listado físico El Ávila", "Dx: Polit"),
  mk("Graciela Zerpa", "", "88 años", H_AVILA, "Listado físico El Ávila", "Dx: Tx musculoesquelético / síndrome compartimental"),
  mk("Alejandro Morillo", "", "22 años", H_AVILA, "Listado físico El Ávila", "Dx: Tx musculoesquelético"),
  mk("Vanesa Mero", "", "30 años", H_AVILA, "Listado físico El Ávila", ""),
  mk("Sofia González", "", "8 años", H_AVILA, "Listado físico El Ávila", "Dx: Tx musculoesquelético"),
  mk("Juan Miguel González", "", "10 años", H_AVILA, "Listado físico El Ávila", "Dx: Tx tobillo izquierdo"),
  mk("María Alejandra Rodríguez", "", "45 años", H_AVILA, "Listado físico El Ávila", "Dx: Tx musculoesquelético"),
  mk("Marta Nova", "", "63 años", H_AVILA, "Listado físico El Ávila", ""),
  mk("Greisly Lovera", "18010500", "37 años", H_AVILA, "Listado físico El Ávila", "Dx: Fx costal / Fx esternal-costal"),
  mk("María Fernanda Padro", "34055623", "15 años", H_AVILA, "Listado físico El Ávila", "Dx: Tx mano izquierda"),
  mk("Leandro González", "27027480", "28 años", H_AVILA, "Listado físico El Ávila", ""),
  mk("Marialy Marcano", "6498112", "58 años", H_AVILA, "Listado físico El Ávila", ""),
  mk("Elias Baladín", "6480632", "62 años", H_AVILA, "Listado físico El Ávila", "Alérgico a sulfa · Dx: Escoriaciones"),
  mk("Ricardo González", "3152093", "78 años", H_AVILA, "Listado físico El Ávila", "Dx: HTA"),
  mk("Diego Díaz", "3255574", "20 años", H_AVILA, "Listado físico El Ávila", "Alérgico a aspirina · Dx: Tx tobillo izquierdo / politraumatizado"),
  mk("Juan Pacheco", "13374571", "50 años", H_AVILA, "Listado físico El Ávila", "Dx: Tx rodilla derecha"),
  mk("María Alejandra Janes", "11234099", "70 años", H_AVILA, "Listado físico El Ávila", "Dx: Tx rodilla izquierda"),
  mk("Juan Carlos Damasco", "10114024", "57 años", H_AVILA, "Listado físico El Ávila", "Dx: Tx craneoencefálico"),
  mk("Carli Damata", "28458908", "20 años", H_AVILA, "Listado físico El Ávila", "Dx: Polit región umbilical"),
  mk("Luz Hernández", "6338662", "54 años", H_AVILA, "Listado físico El Ávila", "Dx: Otitis externa / herida labio superior"),
  mk("Enrique Gil", "16032740", "42 años", H_AVILA, "Listado físico El Ávila", "Dx: Polit"),
  mk("Cecilia Sureck", "9963484", "79 años", H_AVILA, "Listado físico El Ávila", "Alergia: mariscos/aspirina · Dx: Traumatismo contuso"),
  // Items 52-62
  mk("Jesús Arturo Núñez", "4356767", "71 años", H_AVILA, "Listado físico El Ávila", "Dx: Mareo / náuseas / Losartan"),
  mk("Javier Suárez", "11690335", "53 años", H_AVILA, "Listado físico El Ávila", "Dx: Polit PGB"),
  mk("Robert Reyes", "13680249", "47 años", H_AVILA, "Listado físico El Ávila", "Dx: Polit"),
  mk("Reina Bautista", "5090093", "70 años", H_AVILA, "Listado físico El Ávila", "Dx: Polit"),
  mk("Yanoski Uzcátegui", "5572078", "67 años", H_AVILA, "Listado físico El Ávila", "Dx: Tx lóbulo izquierdo / traumatismo"),
  mk("Oenia Acosta", "6889138", "60 años", H_AVILA, "Listado físico El Ávila", "Dx: Tx lóbulo izquierdo / traumatismo"),
  mk("Lalongo De Basillo", "81A181", "87 años", H_AVILA, "Listado físico El Ávila", "Dx: Polit", "INGRESO"),
  mk("Donato Enro", "4565942", "70 años", H_AVILA, "Listado físico El Ávila", "Dx: Polit inestabilidad hemodinámica"),
  mk("Hamping Feng", "83812553", "35 años", H_AVILA, "Listado físico El Ávila", "Dx: Polit / esguince pie izquierdo"),
  mk("Karin Aguilar", "6123953", "65 años", H_AVILA, "Listado físico El Ávila", "Dx: Polit"),
  mk("Laura Marquina", "17323315", "42 años", H_AVILA, "Listado físico El Ávila", "Dx: Politraumatismo"),
  // Items 63+
  mk("Pablo González", "1868258", "88 años", H_AVILA, "Listado físico El Ávila", "Dx: TCE (datos parciales — verificar original)"),
  mk("Haidev Rivas", "2958321", "78 años", H_AVILA, "Listado físico El Ávila", ""),
  mk("Rina Games", "13290230", "50 años", H_AVILA, "Listado físico El Ávila", ""),
  mk("Arnoldo Teran", "19610169", "36 años", H_AVILA, "Listado físico El Ávila", ""),
  mk("Luilan Fung", "16033791", "62 años", H_AVILA, "Listado físico El Ávila", ""),
  mk("Giber Jaspe", "6440415", "63 años", H_AVILA, "Listado físico El Ávila", ""),
  mk("Carlos Salazar", "6488550", "64 años", H_AVILA, "Listado físico El Ávila", ""),
  mk("Li Quanhui", "", "49 años", H_AVILA, "Listado físico El Ávila", ""),

  // ── Hospital Militar Universitario Dr. Carlos Arvelo ──
  // Lista de Personal de Contingencia 24JUN26
  // Fuente: listado oficial impreso (fotos recibidas)
  // NOTA: Items 65–112 no visibles en las fotos compartidas — pendiente completar
];

const H_ARVELO = "Hospital Militar Dr. Carlos Arvelo";
const arvelo = [
  // Fuente: PDF oficial "Lista de Personal de Contingencia 24JUN26" (5 páginas)
  // NOTA: Items 89–112 no presentes en el documento original
  mk("Murillo Landaeta Kéliz", "28443736", "23 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: El Paraíso"),
  mk("López Joselyn", "15034143", "45 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: San Martín"),
  mk("Visedha González", "26668182", "28 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: El Paraíso"),
  mk("Mora Yosmar", "11649384", "52 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Artigas"),
  mk("Castillo Deimar", "21282503", "33 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Antimano"),
  mk("Gámez Torres Heyribi", "33025749", "20 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Guairataro"),
  mk("Rangel Yesenia", "11380548", "54 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Catia"),
  mk("Ramírez Amundarain Ivana", "14451022", "50 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Capuchino"),
  mk("Briceño Mirabal Josefina", "3970261", "77 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Catia"),
  mk("Luca González Yamilet", "13610512", "49 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Artigas"),
  mk("Montilla Zelaya Herrera", "6285593", "54 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: San Martín"),
  mk("Barrios Yolanda", "5323419", "77 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: San Martín"),
  mk("Álvarez Bermo Elsy", "11697809", "53 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: San Martín"),
  mk("Brito Alvarado Camila", "32730226", "17 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Macuto"),
  mk("Dorta Rodríguez Delia", "6124942", "92 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Quinta Crespo"),
  mk("Coen Blanco", "5013048", "66 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: San Martín"),
  mk("Morillo Hernández Nehomar", "15280448", "45 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Comandancia"),
  mk("Murillo Landaeta Yorgelis Yadil", "28440024", "26 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: San Martín"),
  mk("Castro Lauriana", "567005", "66 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Hernández Lilia", "16598007", "42 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Sánchez Alvarado Stefani", "31913023", "19 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: San Martín"),
  mk("Alondra Díaz Delismar del V.", "20102925", "35 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Higuerote"),
  mk("Torres Yenile", "23634549", "34 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: San Martín"),
  mk("Hernández Pérez Asdrúbal", "13641724", "48 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: El Paraíso"),
  mk("Aguilar Raúl", "648196", "63 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: San Juan"),
  mk("Salas Héctor", "5921822", "65 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: San Martín"),
  mk("Peña Emma", "2528862", "86 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: San Martín"),
  mk("Guampa Pavia Milagro", "8203313", "66 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: San Martín"),
  mk("Castillo Rosana", "15366629", "43 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: San Martín"),
  mk("Coen Celia", "5613048", "66 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: San Martín"),
  mk("Pérez Juan", "16083970", "42 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: San Martín"),
  mk("Tadrón Mirian", "3551082", "78 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Capuchino"),
  mk("Milens Gladys", "5114187", "68 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Artigas"),
  mk("Espinoza Germán", "10810746", "57 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Paraíso"),
  mk("Aguilar Carmen", "", "21 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: San Martín"),
  mk("Pinto José", "649768", "77 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: San Martín"),
  mk("Salma Yésica", "22017564", "31 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Carapita"),
  mk("Gómez Críspulo", "33025749", "20 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Guarataro"),
  mk("Durán Aura", "6330439", "68 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Los Teques"),
  mk("Cogollo Deiner", "31572269", "19 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: San Martín"),
  mk("Guanche Delfín", "3611764", "74 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("María Fragozo Peña", "4556514", "69 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Delia de Guerrero Peña", "11642518", "50 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Catia"),
  mk("Ana de Pablo", "4631806", "76 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Navas Yayaira", "18210310", "35 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Artigas"),
  mk("García Diana", "6270588", "59 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Zonis Nalleli", "14289990", "44 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: San Juan"),
  mk("Suares Tomasa", "33067691", "16 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Velásquez Jolimar", "11638401", "53 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Varela María", "21364211", "32 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Villao Pastora Ducieidis", "", "30 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: San Juan"),
  mk("Hernández de Collado Mónica", "8152742", "55 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("González Viviana", "12540389", "58 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Brito Vasquez Nélide", "5120175", "69 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: San Martín"),
  mk("Guzmán Aracelis", "31556775", "20 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: San Antonio"),
  mk("Gómez Apostol Valentina", "", "20 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Pastora"),
  mk("Herrera Victor", "26924423", "27 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Rojas Jesús", "2321156", "48 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Santos Flores Mario H.", "24869842", "30 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Garati Cova", "25132946", "24 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Briceño María", "1445299", "90 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Legorburu Juan Andrés", "6914851", "58 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Los Palos Grandes"),
  mk("Anchundia Isaac", "2199218", "81 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Paraíso"),
  mk("Pericaguan Milba", "13375459", "49 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: San Martín"),
  mk("Blanco Milquiades", "15147810", "46 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Quao Suylin", "16135135", "40 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Castillo Alba", "15947646", "42 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: San Martín"),
  mk("Mariño Castello", "31289457", "35 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Pastora"),
  mk("Marcano Suse", "25612616", "33 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Catia"),
  mk("Marcano Odalis", "10581191", "57 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Pérez Infantes", "33218435", "18 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Hetty Sam", "16769990", "37 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Garazo Andrea", "19445453", "34 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("González Ahimar", "6270109", "56 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Caracas"),
  mk("Olivero Ana", "4281217", "72 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Ramos Joselina Alvarado", "6916206", "61 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Ismael Rumanca Torres", "31312002", "23 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Nelda Bello", "11015849", "47 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: San Martín"),
  mk("Monsalve Kiana", "13466342", "47 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: San Martín"),
  mk("Salas Yilseya", "9999170", "57 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Paraíso"),
  mk("Laya Yosil", "15034147", "45 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Urdaneta"),
  mk("Salazar Carlos", "27178947", "28 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Penal"),
  mk("Vargas Nancy", "5323419", "47 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: San Martín"),
  mk("Moreno Yulitza", "", "34 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Artigas"),
  mk("Salazar Yajaira", "15160619", "44 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Delicias"),
  mk("Acosta Ámber", "31950088", "19 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: San Juan"),
  mk("Durán José", "10549929", "59 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Artigas"),
  mk("Fernández Lilia", "16598007", "42 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  // Items 89–112: no presentes en el documento original
  mk("Stefani Villegas", "28453309", "25 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Álvarez Anderson", "17755833", "29 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: San Juan"),
  mk("Marcano González Mara", "33010536", "16 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Hamer Morles Álvarez", "32922380", "16 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Carvajal Jon", "17982017", "41 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Jusmary Tovar", "19272179", "37 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Luis Martinez", "10683348", "49 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Giovanny López", "15625037", "47 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Torrellas Maria", "29656134", "29 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Ortega Belde", "5827267", "67 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("González Ahimar", "", "56 años", H_ARVELO, "Lista Contingencia 24JUN26", ""),
  mk("Palmer Darliman", "27956623", "26 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Rodriguez Luis", "24802937", "31 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Paola González", "27042446", "27 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Ramos Mayerling", "15780524", "41 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Luis Martinez", "6683348", "49 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Casalta 3"),
  mk("Arias Fructuoso", "6156642", "65 años", H_ARVELO, "Lista Contingencia 24JUN26", "GNB"),
  mk("Belde Ortega", "5827267", "67 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Mayerling Ramos", "15780524", "41 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Yoselyn Guerra", "6502264", "59 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Lourdes Jiménez", "8654412", "59 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Fuerte Tiuna"),
  mk("Yakelin Santana", "10398248", "56 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Los Corales"),
  mk("González Martínez María Cristina", "11192760", "55 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("López Morales César", "23622267", "30 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Comandancia GNB"),
  mk("Noguera Arángel", "31752473", "19 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Macuto La Guaira"),
  mk("Rangel Dephne", "29619923", "23 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Macuto La Guaira"),
  mk("Mariany Salazar", "32454171", "19 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Macuto La Guaira"),
  mk("Franklin Pérez Guanche", "17160400", "42 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Génesis Silva", "25874216", "30 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Danieli Carelis Garcia", "", "30 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Osorio Elvia", "24153416", "33 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Macuto La Guaira"),
  mk("Elías Melo", "20888810", "33 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Maite Coa", "11165265", "48 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Elvis Etolino", "32335642", "19 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Sergio Pérez", "32635244", "15 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Florián Cedeño Alberto", "26898085", "28 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Guarenas"),
  mk("Yan Iduara", "32106240", "18 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
  mk("Yoselyn Guerra", "31752478", "19 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
];

// ── Hospital Ciudad Caribia ──
// Fuente: pizarras fotografiadas (25/06/26 y 26/06/26)
const H_CARIBIA = "Hospital Ciudad Caribia";
const caribia = [
  // Ingresados 25/06/26 (pizarra 1)
  mk("Vetencourt Ninoska", "13224566", "55 años", H_CARIBIA, "Pizarra ingresados 25/06/26", "Proc: Los Corales · 8pm"),
  mk("Dewuentt Rosibel", "27042604", "27 años", H_CARIBIA, "Pizarra ingresados 25/06/26", "Proc: Caribe · 8pm"),
  mk("Veliz Asheley", "31748046", "19 años", H_CARIBIA, "Pizarra ingresados 25/06/26", "Proc: Caribe · 8pm"),
  mk("Roque Tomasa", "5094730", "84 años", H_CARIBIA, "Pizarra ingresados 25/06/26", "Proc: Caribe · 8pm"),
  mk("Vélez Mayuri", "12717904", "51 años", H_CARIBIA, "Pizarra ingresados 25/06/26", "Proc: Caraballeda · 8pm"),
  mk("Tohormes Adsony", "12866403", "50 años", H_CARIBIA, "Pizarra ingresados 25/06/26", "Proc: Caribe · 8pm"),
  mk("Borges Mariela", "9855570", "57 años", H_CARIBIA, "Pizarra ingresados 25/06/26", "Proc: Caribe · 8pm"),
  mk("Escobar Cleiver", "27552520", "28 años", H_CARIBIA, "Pizarra ingresados 25/06/26", "Proc: Cdad. Caribia · 8pm"),
  mk("Dávila Anabella", "31439901", "13 años", H_CARIBIA, "Pizarra ingresados 25/06/26", "Proc: Los Corales · CI con prefijo M en original · 8pm"),
  // Traslados 26/06/26 (pizarra 2) — fueron trasladados a otro centro
  mk("Suárez Claret", "6471600", "75 años", H_CARIBIA, "Pizarra traslados 26/06/26", "Traslado a Hospital Militar · 8:30am", "Traslado"),
  mk("Mayor Eduardo", "16091866", "41 años", H_CARIBIA, "Pizarra traslados 26/06/26", "Traslado a Hospital Militar · 8:30am", "Traslado"),
  mk("Santos Carlos", "3405475", "73 años", H_CARIBIA, "Pizarra traslados 26/06/26", "Traslado a CDD Los Mercedes · 12:19pm", "Traslado"),
  mk("Aguilar Alfredo", "10487289", "57 años", H_CARIBIA, "Pizarra traslados 26/06/26", "Traslado a CDD Los Mercedes · 12:19pm", "Traslado"),
  // Altas por mejoría 26/06/26 (pizarra 2)
  mk("Valeria de la Oz", "29521698", "25 años", H_CARIBIA, "Pizarra altas 26/06/26", "Alta 8:57am", "De alta"),
  mk("Herrero Alvaro", "22504476", "", H_CARIBIA, "Pizarra altas 26/06/26", "Alta · CI parcialmente ilegible en original", "De alta"),
  mk("Arteaga Rudi", "10581795", "", H_CARIBIA, "Pizarra altas 26/06/26", "Alta 12:00m", "De alta"),
];

// ── Hospital Médico Quirúrgico Dr. Ricardo Baquero González (Periférico de Catia) ──
const H_CATIA = "H. Baquero González - Periférico de Catia";
const catia = [
  // ── Traumatología en Pasillo (lista impresa) ──
  mk("Yeleny Chirino", "12389975", "58 años", H_CATIA, "Lista impresa 25/06/26", "Sec: Traumatología Pasillo · Proc: La Guaira - Playa Grande"),
  mk("José Alarcón", "13515304", "47 años", H_CATIA, "Lista impresa 25/06/26", "Sec: Traumatología Pasillo · Proc: La Guaira - Caribe"),
  // ── Trauma Shock (sin CI en lista) ──
  mk("Jose Arvojo", "", "", H_CATIA, "Lista impresa 25/06/26", "Sec: Trauma Shock · Cama #1"),
  mk("Petra Piñate", "", "", H_CATIA, "Lista impresa 25/06/26", "Sec: Trauma Shock · Cama #2"),
  mk("José Marquez", "", "", H_CATIA, "Lista impresa 25/06/26", "Sec: Trauma Shock · Cama #3"),
  mk("Bertma Laguna", "", "", H_CATIA, "Lista impresa 25/06/26", "Sec: Trauma Shock · Cama #4"),
  mk("José Archeta", "", "", H_CATIA, "Lista impresa 25/06/26", "Sec: Trauma Shock · Cama #5"),
  // ── Hospitalización Mujeres ──
  mk("Carmen Marín", "", "53 años", H_CATIA, "Lista impresa 25/06/26", "Sec: Hosp. Mujeres · Cama #4 · Proc: Caracas - Catia"),
  mk("Amarili Blanco", "", "67 años", H_CATIA, "Lista impresa 25/06/26", "Sec: Hosp. Mujeres · Cama #3"),
  mk("Hillali Rodriguez", "23710358", "31 años", H_CATIA, "Lista impresa 25/06/26", "Sec: Hosp. Mujeres · Cama #1 · Proc: Caracas - Catia"),
  // ── Hospitalización Masculinos ──
  mk("Ivan Mendieta", "", "65 años", H_CATIA, "Lista impresa 25/06/26", "Sec: Hosp. Masculinos · Cama #2"),
  mk("Deivy Rodriguez", "", "19 años", H_CATIA, "Lista impresa 25/06/26", "Sec: Hosp. Masculinos · Cama #1 · Proc: Caracas - Catia"),
  // ── Piso de Cirugía (lista impresa 25/06/26 4:00pm) ──
  mk("Luisanyeli Zapata", "31962237", "20 años", H_CATIA, "Lista impresa 25/06/26", "Sec: Cirugía · Cama #3 · Nota: hay otra entrada con CI 30114918 en Cama #10 — verificar si son personas distintas"),
  mk("Valella Gorrin", "30114918", "22 años", H_CATIA, "Lista impresa 25/06/26", "Sec: Cirugía · Cama #10 · Proc: La Guaira - Playa Grande"),
  mk("Jhonson Estebes", "29571733", "24 años", H_CATIA, "Lista impresa 25/06/26", "Sec: Cirugía · Cama #11 · Proc: La Guaira - Monte Sano"),
  mk("Yeison Blanco", "", "menor", H_CATIA, "Lista impresa 25/06/26", "Sec: Cirugía · Cama #18"),
  mk("Daner Salazar", "11557611", "50 años", H_CATIA, "Lista impresa 25/06/26", "Sec: Cirugía · Cama #17 · Proc: Caracas - Catia"),
  // ── Traumatología Femenino ──
  mk("Yenny Gonzales", "13828545", "47 años", H_CATIA, "Lista impresa 25/06/26", "Sec: Trauma Fem · Cama #1 · Proc: La Guaira - Carayaca"),
  mk("Carla Leen", "17700355", "49 años", H_CATIA, "Lista impresa 25/06/26", "Sec: Trauma Fem · Cama #2 · Proc: La Guaira"),
  mk("Tania Terán", "11409997", "55 años", H_CATIA, "Lista impresa 25/06/26", "Sec: Trauma Fem · Cama #3 · Proc: La Guaira - Av. Principal"),
  mk("Rosa Garce", "20604161", "31 años", H_CATIA, "Lista impresa 25/06/26", "Sec: Trauma Fem · Cama #4 · Proc: La Guaira - Playa Grande"),
  mk("Margaret Pestano", "19915985", "35 años", H_CATIA, "Lista impresa 25/06/26", "Sec: Trauma Fem · Cama #11 · Proc: La Guaira - Jaivata"),
  mk("Yeritma Cortez", "6340991", "58 años", H_CATIA, "Lista impresa 25/06/26", "Sec: Trauma Fem · Cama #12 · Proc: La Guaira - Caribe"),
  mk("Leoneidi Sidira", "25175345", "30 años", H_CATIA, "Lista impresa 25/06/26", "Sec: Trauma Fem · Cama #14 · Proc: La Guaira - Tanaguarena"),
  mk("Alexandra Chirino", "31995517", "21 años", H_CATIA, "Lista impresa 25/06/26", "Sec: Trauma Fem · Cama #15 · Proc: La Guaira - Carlos Julio"),
  mk("Dilia Lemos", "13531669", "49 años", H_CATIA, "Lista impresa 25/06/26", "Sec: Trauma Fem · Cama #16 · Proc: Caracas - La Silsa"),
  mk("Abdaly Villamizar", "26254624", "28 años", H_CATIA, "Lista impresa 25/06/26", "Sec: Trauma Fem · Cama #17 · Proc: La Guaira - Caraballeda"),
  mk("Silvia Yanez", "3557870", "77 años", H_CATIA, "Lista impresa 25/06/26", "Sec: Trauma Fem · Cama #18 · Proc: Caracas - Catia"),
  mk("Ana Abreu", "22636301", "36 años", H_CATIA, "Lista impresa 25/06/26", "Sec: Trauma Fem · Cama #20 · Proc: Caracas - Catia"),
  // ── Traumatología Masculino ──
  mk("José Planas", "12163470", "52 años", H_CATIA, "Lista impresa 25/06/26", "Sec: Trauma Masc · Cama #6 · Proc: La Guaira - Carayaca"),
  mk("Álvaro Fabias", "9960614", "56 años", H_CATIA, "Lista impresa 25/06/26", "Sec: Trauma Masc · Cama #7 · Proc: Caracas - Sabana Grande"),
  mk("Jesús Orozco", "8178191", "63 años", H_CATIA, "Lista impresa 25/06/26", "Sec: Trauma Masc · Cama #9 · Proc: La Guaira - Sumba"),
  // ── Pediatría ──
  mk("Edvangely Carboda", "", "6 años", H_CATIA, "Lista impresa 25/06/26", "Sec: Pediatría · Cama #5 · Proc: Vía La Guaira"),
  mk("Sofia López", "", "15 años", H_CATIA, "Lista impresa 25/06/26", "Sec: Pediatría · Cama #6 · Proc: La Guaira - Caribe"),
  mk("Valeri López", "", "12 años", H_CATIA, "Lista impresa 25/06/26", "Sec: Pediatría · Cama #7 · Proc: La Guaira - Caribe"),
  mk("Ashley López", "", "5 años", H_CATIA, "Lista impresa 25/06/26", "Sec: Pediatría · Cama #3 · Proc: La Guaira - Caribe"),
  // ── Actualización manuscrita (Ministerio de Salud) ──
  mk("Gustavo Avile", "", "52 años", H_CATIA, "Actualización manuscrita", "Dx: Trauma"),
  mk("González Orlando", "", "72 años", H_CATIA, "Actualización manuscrita", "Dx: Trauma"),
  mk("Kenic Nuñez", "", "40 años", H_CATIA, "Actualización manuscrita", "Dx: Trauma"),
  mk("Chacin Aldo", "", "54 años", H_CATIA, "Actualización manuscrita", "Dx: Cirugía"),
  mk("Tortoza Oscar", "", "37 años", H_CATIA, "Actualización manuscrita", "Dx: Trauma"),
  mk("Nieto Milanger", "", "18 años", H_CATIA, "Actualización manuscrita", "Dx: Trauma"),
  mk("Mato Carlos", "", "26 años", H_CATIA, "Actualización manuscrita", "Dx: Trauma"),
  mk("Rosmel Nieves", "", "30 años", H_CATIA, "Actualización manuscrita", "Dx: Trauma"),
  mk("Dereet Torres", "", "17 años", H_CATIA, "Actualización manuscrita", "Dx: Cirugía"),
  mk("Colmenares Guede", "", "58 años", H_CATIA, "Actualización manuscrita", "Dx: Trauma"),
  mk("Greisy Oropeza", "", "20 años", H_CATIA, "Actualización manuscrita", "Dx: Trauma"),
  mk("Jesus Vegas", "", "27 años", H_CATIA, "Actualización manuscrita", "Dx: Trauma"),
  mk("Jhonson Steban", "", "24 años", H_CATIA, "Actualización manuscrita", "Dx: Trauma"),
  mk("Zapata Luisangelis", "", "20 años", H_CATIA, "Actualización manuscrita", "Dx: Trauma"),
  mk("Plana Benito", "", "52 años", H_CATIA, "Actualización manuscrita", "Dx: Trauma"),
  mk("Villamizar Abdalis", "", "28 años", H_CATIA, "Actualización manuscrita", "Dx: Trauma"),
  mk("Teran Audia", "", "54 años", H_CATIA, "Actualización manuscrita", "Dx: Trauma"),
  mk("Jose Agre", "", "49 años", H_CATIA, "Actualización manuscrita", "Dx: Trauma"),
  mk("González Edgar", "", "48 años", H_CATIA, "Actualización manuscrita", "Dx: Cirugía"),
  mk("González Yurmis", "", "47 años", H_CATIA, "Actualización manuscrita", "Dx: Trauma"),
  mk("Villamizar Reino", "", "", H_CATIA, "Actualización manuscrita", "Dx: Trauma"),
  // ── Lista manuscrita adicional ──
  mk("Yismar Quintona", "", "3 años", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma"),
  mk("Marlene Teran", "", "6 años", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma"),
  mk("Lopez Neiber", "", "22 años", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma"),
  mk("Janeht Seville", "", "49 años", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma"),
  mk("Abreu Isabel", "", "36 años", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma"),
  mk("Perdomo Yoiner", "", "32 años", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma"),
  mk("Patricia Mondiole", "", "51 años", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma"),
  mk("Franklin Alfonzo", "", "65 años", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma"),
  mk("Caroline Salazar", "", "49 años", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma"),
  mk("Yurbely Martins", "", "menor", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma"),
  mk("Marx Yepez", "", "30 años", H_CATIA, "Lista manuscrita adicional", "Dx: Pediatría"),
  mk("Yorber Peña", "", "36 años", H_CATIA, "Lista manuscrita adicional", "Dx: Cirugía"),
  mk("Zacaria Alexis", "", "51 años", H_CATIA, "Lista manuscrita adicional", "Dx: Cirugía"),
  mk("González Ana", "", "46 años", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma"),
  mk("Rangel Ender", "", "30 años", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma"),
  mk("Milagros Linares", "", "45 años", H_CATIA, "Lista manuscrita adicional", "Dx: MI"),
  mk("Nuñez Alfredo", "", "62 años", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma"),
  mk("Yelitza Garfonia", "", "46 años", H_CATIA, "Lista manuscrita adicional", "Dx: MI"),
  mk("Cordero Jose", "", "28 años", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma"),
  mk("Lopez Valeria", "", "20 años", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma"),
  mk("Dario Ruben", "", "64 años", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma"),
  mk("Maria Yobana", "", "50 años", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma"),
  mk("Mejia Yanez", "", "40 años", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma Schock"),
  mk("Medina Nelson", "", "49 años", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma"),
  mk("Leon Karlas", "", "49 años", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma"),
  mk("Pico Yenny", "", "54 años", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma"),
  mk("Geecen Jhon", "", "42 años", H_CATIA, "Lista manuscrita adicional", "Dx: Medicina General"),
  mk("Chirino Alexandro", "", "21 años", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma"),
  mk("Cortez Yurimar", "", "58 años", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma"),
  mk("Pestana Vargas Madelin", "", "35 años", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma"),
  mk("Lemus Dilsia", "", "49 años", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma"),
  mk("Silvera Leoneidy", "", "30 años", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma Schock"),
  mk("Ereu Anyisnay", "", "23 años", H_CATIA, "Lista manuscrita adicional", "Dx: MI"),
  mk("Rodriguez Miguel", "", "56 años", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma"),
  mk("Cerrano Miguel", "", "11 años", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma"),
  mk("Guillen Mariana", "", "6 años", H_CATIA, "Lista manuscrita adicional", "Dx: Pediatría"),
  mk("Materan Valery", "", "7 años", H_CATIA, "Lista manuscrita adicional", "Dx: Pediatría"),
  mk("Farias Alvaro", "", "56 años", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma Schock"),
  mk("Zaya Estefania", "", "14 años", H_CATIA, "Lista manuscrita adicional", "Dx: Cirugía"),
  mk("Mora Hilari", "", "13 años", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma"),
  mk("Garces Rosa Angel", "", "32 años", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma"),
  mk("Hernandez Aranza", "", "11 años", H_CATIA, "Lista manuscrita adicional", "Dx: Pediatría"),
  mk("Soya Estefonia", "", "14 años", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma"),
  mk("Garces Miguel", "", "28 años", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma"),
  mk("Carrero Ligney", "", "45 años", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma"),
  mk("Delgado Orlando", "", "45 años", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma"),
  mk("Rivero Eduyelis", "", "6 años", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma"),
  mk("Teran Ezequiel", "", "15 años", H_CATIA, "Lista manuscrita adicional", "Dx: MI"),
  mk("Castro Lien", "", "6 años", H_CATIA, "Lista manuscrita adicional", "Dx: Pediatría"),
  mk("Carrasco Gyotisbel", "", "47 años", H_CATIA, "Lista manuscrita adicional", "Dx: Cirugía"),
  mk("Chirino Yeleini", "", "57 años", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma"),
  mk("Benites Karli", "", "43 años", H_CATIA, "Lista manuscrita adicional", "Dx: Trauma"),
];



// Merge all patient arrays
const pacientesAll = [...pacientes, ...arvelo, ...caribia, ...catia];

const sitiosExternos = [
  { nombre: "Desaparecidos Terremoto Venezuela", url: "https://desaparecidosterremotovenezuela.com", desc: "Citado en CNN. Reporta a alguien con quien no logras contactar, o avisa cuando lo encuentres." },
  { nombre: "Venezuela Reporta", url: "https://venezuelareporta.org", desc: "Registro comunitario con foto de cada persona buscada y filtro por nombre/zona." },
  { nombre: "Venezuela Te Busca", url: "https://venezuelatebusca.com", desc: "Registrar y marcar personas como 'encontradas'. Más simple, sin fotos." },
  { nombre: "Ayuda Venezuela", url: "https://ayudavenezuela.app", desc: "Refugios, hospitales, donación de sangre, daños estructurales y guía para venezolanos en el exterior." },
  { nombre: "SismoVenezuela", url: "https://www.sismovenezuela.com", desc: "Mapa que consolida reportes de YouTube, X e Instagram en tiempo real." },
  { nombre: "Mapa de Daños Venezuela", url: "https://terremotovenezuela.com", desc: "Mapa de edificios afectados por dirección/zona." },
  { nombre: "Mapa de Emergencia y Rescate", url: "https://terremotovenezuela.app", desc: "Reporte ciudadano por colores y directorio de teléfonos de emergencia de Caracas." },
  { nombre: "Ayuda Terremoto Venezuela", url: "https://www.ayudasismo.org", desc: "Pensado para coordinadores: reporta necesidades y prioriza casos." },
];

const PAGE_SIZE = 40; // 4 columnas × 10 filas

// ============================================================================
export default function App() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [hospitalFilter, setHospitalFilter] = useState(null);
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState("buscar");
  const [copied, setCopied] = useState(null);
  const [listening, setListening] = useState(false);

  const startVoice = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Tu navegador no soporta búsqueda por voz. Intenta con Chrome.");
    const rec = new SR();
    rec.lang = "es-VE";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.onresult = (e) => setQuery(e.results[0][0].transcript);
    rec.start();
  }, []);


  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 220);
    return () => clearTimeout(t);
  }, [query]);

  const copyCard = useCallback((r) => {
    const txt = [
      `*${r.nombre}*`,
      `Hospital: ${r.hospital}`,
      r.cedula ? `CI: ${fmtCedula(r.cedula)}` : null,
      r.edad ? `Edad: ${r.edad === "menor" || parseInt(r.edad) < 18 ? "Menor de edad" : r.edad}` : null,
      r.notas || null,
    ].filter(Boolean).join("\n");
    navigator.clipboard?.writeText(txt).then(() => {
      setCopied(r.id);
      setTimeout(() => setCopied(null), 1800);
    });
  }, []);

  const [formText, setFormText] = useState("");
  const [formHospital, setFormHospital] = useState("");
  const [formResult, setFormResult] = useState(null);
  const [comunidad, setComunidad] = useState(() => {
    try { return JSON.parse(localStorage.getItem("comunidad") || "[]"); } catch { return []; }
  });
  const [encontrados, setEncontrados] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("encontrados") || "[]")); } catch { return new Set(); }
  });

  const toggleEncontrado = (id) => {
    setEncontrados(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem("encontrados", JSON.stringify([...next]));
      return next;
    });
  };

  useEffect(() => { setPage(1); }, [debouncedQuery, hospitalFilter]);

  const allRecords = useMemo(() => [...pacientesAll, ...comunidad], [comunidad]);
  const hospitales = useMemo(() => [...new Set(allRecords.map(r => r.hospital))].sort(), [allRecords]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim();
    const cedQ = normCedula(q);
    let pool = hospitalFilter ? allRecords.filter(r => r.hospital === hospitalFilter) : allRecords;
    if (!q) return hospitalFilter ? pool.slice(0, PAGE_SIZE) : [];

    const matches = pool.filter(r => {
      if (cedQ.length >= 4 && normCedula(r.cedula).includes(cedQ)) return true;
      return fuzzyMatch(q, r.nombre);
    });

    // Sort: exact match first, then starts-with, then contains, then fuzzy
    const qLow = stripAccents(q).toLowerCase();
    return matches.sort((a, b) => {
      const score = r => {
        const n = stripAccents(r.nombre).toLowerCase();
        if (n === qLow) return 4;
        if (n.startsWith(qLow)) return 3;
        if (n.includes(qLow)) return 2;
        return 1;
      };
      return score(b) - score(a);
    });
  }, [debouncedQuery, hospitalFilter, allRecords]);

  const handleSubmitComunidad = () => {
    if (!formText.trim() || !formHospital.trim()) return;
    const parsed = parseSubmission(formText, formHospital.trim());
    const results = parsed.map(p => {
      const cedMatch = p.cedula && allRecords.some(r => normCedula(r.cedula) === p.cedula && r.cedula);
      const nameMatch = allRecords.find(r => {
        const dist = levenshtein(
          phoneticNorm(p.nombre.toLowerCase()),
          phoneticNorm(r.nombre.toLowerCase())
        );
        return dist === 0;
      });
      if (cedMatch) return { ...p, status: "exacto", match: allRecords.find(r => normCedula(r.cedula) === p.cedula) };
      if (nameMatch) return { ...p, status: "posible", match: nameMatch };
      return { ...p, status: "nuevo" };
    });
    const nuevos = results.filter(r => r.status === "nuevo").map(p => ({
      id: Date.now() + Math.random(), nombre: p.nombre, cedula: p.cedula,
      edad: p.edad, hospital: p.hospital, fuente: "Aporte comunidad", notas: "", estado: ""
    }));
    if (nuevos.length) {
      const updated = [...comunidad, ...nuevos];
      setComunidad(updated);
      localStorage.setItem("comunidad", JSON.stringify(updated));
    }
    setFormResult(results);
    setFormText("");
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Bandera */}
      <div className="h-1.5 flex">
        <div className="flex-1" style={{ backgroundColor: "#FCD34D" }} />
        <div className="flex-1" style={{ backgroundColor: "#2563EB" }} />
        <div className="flex-1" style={{ backgroundColor: "#DC2626" }} />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-20 bg-[#0b0d12] text-white px-4 sm:px-8 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-lg">🇻🇪</span>
          <span className="font-bold text-sm sm:text-base">Buscador de Pacientes · Sismo 24/06/2026</span>
        </div>
        <button
          onClick={() => setTab(tab === "buscar" ? "sitios" : "buscar")}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
            tab === "buscar"
              ? "bg-red-600 text-white hover:bg-red-500"
              : "bg-slate-700 text-slate-200 hover:bg-slate-600"
          }`}
        >
          {tab === "buscar" ? (
            <><span>🔗</span> Otros sitios de ayuda</>
          ) : (
            <><span>🔍</span> Volver al buscador</>
          )}
        </button>
      </nav>

      {tab === "buscar" ? (
        <>
          {/* Hero */}
          <header className="bg-gradient-to-b from-[#0b0d12] to-[#3b0a0a] text-white px-4 sm:px-8 pt-10 pb-20 text-center">
            <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight">
              ¿Dónde está internado tu familiar?
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-3 max-w-lg mx-auto">
              Ingresa el nombre, apellido o cédula. Buscamos incluso si el nombre fue escrito de forma diferente.
            </p>
            <p className="text-slate-400 text-xs mt-2">
              {allRecords.length} registros · {hospitales.length} hospitales
              {encontrados.size > 0 && <span className="text-emerald-400"> · {encontrados.size} ya con familiar ✓</span>}
            </p>
          </header>

          {/* Buscador */}
          <div className="max-w-2xl mx-auto px-4 -mt-8 relative z-10">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-3 space-y-2">
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Nombre, apellido o cédula…"
                  className="w-full pl-12 pr-10 py-3.5 rounded-xl border border-slate-200 text-base focus:outline-none focus:ring-2 focus:ring-red-600 bg-slate-50"
                  autoFocus
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {query && (
                    <button onClick={() => setQuery("")} className="text-slate-400 hover:text-slate-700 p-0.5">
                      <X size={16} />
                    </button>
                  )}
                  <button
                    onClick={startVoice}
                    title="Buscar por voz"
                    className={`p-1 rounded-full transition-all ${listening ? "text-red-500 animate-pulse" : "text-slate-400 hover:text-red-500"}`}
                  >
                    {listening ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>
                </div>
              </div>
              {/* Filtro por hospital */}
              <div className="flex gap-1.5 flex-wrap pb-0.5">
                <button
                  onClick={() => setHospitalFilter(null)}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${!hospitalFilter ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                >Todos</button>
                {hospitales.map(h => (
                  <button key={h}
                    onClick={() => setHospitalFilter(h === hospitalFilter ? null : h)}
                    className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors truncate max-w-[180px] ${hospitalFilter === h ? "bg-red-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                  >{h}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Formulario comunidad — siempre visible, mobile-first */}
          <div className="max-w-2xl mx-auto px-4 mt-4 pb-2">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-100 px-4 py-3">
                <p className="font-semibold text-slate-800 text-sm">¿Tienes información de pacientes?</p>
                <p className="text-xs text-slate-500 mt-0.5">Pega la lista aquí y la agregamos al buscador para todos. La cédula y la edad son opcionales, pero si las tienes, agrégalas — cuantos más datos, mejor.</p>
              </div>
              <div className="p-4 space-y-3">
                <input
                  value={formHospital}
                  onChange={e => setFormHospital(e.target.value)}
                  placeholder="Hospital o centro de salud"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-colors"
                />
                <textarea
                  value={formText}
                  onChange={e => setFormText(e.target.value)}
                  rows={4}
                  placeholder={"Un paciente por línea:\nMaría González - 12.345.678\nJuan Rodríguez - 45 años\nPedro Pérez"}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-colors resize-none leading-relaxed"
                />
                <button
                  onClick={handleSubmitComunidad}
                  disabled={!formText.trim() || !formHospital.trim()}
                  className="w-full bg-red-600 text-white py-3 rounded-xl text-sm font-bold tracking-wide hover:bg-red-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Enviar lista
                </button>
                {formResult && (
                  <div className="space-y-1.5 max-h-44 overflow-y-auto">
                    {formResult.map((r, i) => (
                      <div key={i} className={`flex items-start gap-2 text-xs rounded-xl px-3 py-2.5 ${
                        r.status === "exacto" ? "bg-amber-50 border border-amber-200" :
                        r.status === "posible" ? "bg-blue-50 border border-blue-200" :
                        "bg-emerald-50 border border-emerald-200"
                      }`}>
                        {r.status === "nuevo" ? <CheckCircle size={14} className="text-emerald-600 mt-0.5 shrink-0" /> : <AlertCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />}
                        <div>
                          <span className="font-semibold">{r.nombre}</span>
                          {r.status === "exacto" && <span className="text-amber-700"> · ya registrado en {r.match?.hospital}</span>}
                          {r.status === "posible" && <span className="text-blue-700"> · posible duplicado de "{r.match?.nombre}"</span>}
                          {r.status === "nuevo" && <span className="text-emerald-700"> · agregado</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Resultados */}
          <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            {!debouncedQuery.trim() && !hospitalFilter && (
              <div className="text-center py-12 text-slate-400">
                <Search size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Escribe un nombre, apellido o cédula</p>
                <p className="text-xs mt-1 text-slate-300">También puedes hablar tocando el micrófono 🎤</p>
              </div>
            )}

            {debouncedQuery.trim() && filtered.length === 0 && (
              <div className="max-w-sm mx-auto py-10 px-4 text-center">
                <UserX size={40} className="mx-auto mb-3 text-slate-300" />
                <p className="text-sm font-medium text-slate-600">No encontramos a <span className="font-bold">"{debouncedQuery}"</span></p>
                <p className="text-xs text-slate-400 mt-1 mb-5">Intenta con otro nombre, apellido o número de cédula</p>
                <button
                  onClick={() => setTab("sitios")}
                  className="w-full bg-amber-500 text-white py-3 rounded-xl text-sm font-bold hover:bg-amber-600 active:scale-95 transition-all"
                >
                  Ver sitios especializados en personas desaparecidas →
                </button>
              </div>
            )}

            {filtered.length > 0 && (
              <>
                <p className="text-xs text-slate-500 mb-4">
                  {filtered.length} resultado{filtered.length !== 1 ? "s" : ""} para "<span className="font-semibold">{query}</span>"
                  {totalPages > 1 && ` · página ${page} de ${totalPages}`}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {pageData.map((r) => {
                    const hallado = encontrados.has(r.id);
                    return (
                      <div key={r.id} className={`rounded-xl border p-4 flex flex-col gap-2 shadow-sm transition-all ${hallado ? "bg-emerald-50 border-emerald-300" : "bg-white border-slate-200 hover:shadow-md"}`}>
                        <div className="flex items-start justify-between gap-2">
                          <p className={`font-semibold text-sm leading-tight ${hallado ? "text-emerald-800" : ""}`}>{r.nombre}</p>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {r.estado && (
                              <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                /defunci|fallec/i.test(r.estado) ? "bg-red-100 text-red-700"
                                : /alta/i.test(r.estado) ? "bg-emerald-100 text-emerald-700"
                                : "bg-blue-100 text-blue-700"
                              }`}>{r.estado}</span>
                            )}
                              <button
                              onClick={() => copyCard(r)}
                              title="Copiar para WhatsApp"
                              className="w-7 h-7 rounded-full flex items-center justify-center bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-all active:scale-90"
                            >
                              {copied === r.id ? <CheckCircle size={13} className="text-emerald-500" /> : <Copy size={13} />}
                            </button>
                            <button
                              onClick={() => toggleEncontrado(r.id)}
                              title={hallado ? "Desmarcar" : "Ya está con un familiar"}
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-90 ${hallado ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400 hover:bg-emerald-100 hover:text-emerald-600"}`}
                            >
                              <CheckCircle size={15} />
                            </button>
                          </div>
                        </div>
                        {hallado && (
                          <p className="text-[11px] font-semibold text-emerald-700">✓ Ya está con un familiar</p>
                        )}
                        <div className="text-xs text-slate-500 space-y-1">
                          <p className="flex items-center gap-1"><MapPin size={10} className="shrink-0" /> {r.hospital}</p>
                          <div className="flex gap-3">
                            <span><span className="text-slate-400">CI:</span> <span className="font-mono">{fmtCedula(r.cedula) !== "—" ? fmtCedula(r.cedula) : "—"}</span></span>
                            {r.edad && <span><span className="text-slate-400">Edad:</span> {r.edad === "menor" || parseInt(r.edad) < 18 ? "Menor de edad" : r.edad}</span>}
                          </div>
                          {r.notas && <p className="text-amber-700 leading-snug">{r.notas}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm border border-slate-200 text-slate-500 disabled:opacity-30 hover:bg-slate-100"
                    >
                      <ChevronLeft size={15} /> Anterior
                    </button>
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                        const n = totalPages <= 7 ? i + 1
                          : page <= 4 ? i + 1
                          : page >= totalPages - 3 ? totalPages - 6 + i
                          : page - 3 + i;
                        return (
                          <button key={n} onClick={() => setPage(n)}
                            className={`w-8 h-8 rounded-lg text-sm ${n === page ? "bg-slate-900 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-100"}`}
                          >{n}</button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm border border-slate-200 text-slate-500 disabled:opacity-30 hover:bg-slate-100"
                    >
                      Siguiente <ChevronRight size={15} />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>

          <footer className="text-center pb-8 text-xs text-slate-400 px-4">
            Herramienta de apoyo para ubicar a familiares. No sustituye la confirmación oficial de un hospital, Cruz Roja o Protección Civil.
          </footer>
        </>
      ) : (
        <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">

          {/* Números de emergencia */}
          <section>
            <h2 className="text-base font-bold mb-3 flex items-center gap-2">📞 Números de emergencia Venezuela</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { num: "171", label: "Sistema Nacional de Emergencias", nota: "Ambulancias · Bomberos · Rescate" },
                { num: "0800-SALUD-YA", label: "Ministerio de Salud", nota: "Orientación médica gratuita" },
                { num: "0212-571-1271", label: "Cruz Roja Venezolana", nota: "Localización de personas · Ayuda humanitaria" },
                { num: "0800-2226272", label: "CICPC (0800-CÁMARAS)", nota: "Personas desaparecidas" },
                { num: "0212-509-0011", label: "Protección Civil Nacional", nota: "Coordinación de rescate y emergencias" },
                { num: "0414-100-1717", label: "Defensa Civil Caracas", nota: "Evacuaciones y búsqueda en escombros" },
              ].map(({ num, label, nota }) => (
                <a key={num} href={`tel:${num.replace(/-/g,"")}`}
                  className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-red-300 active:scale-[0.98] transition-all">
                  <span className="font-mono font-bold text-red-600 text-sm shrink-0">{num}</span>
                  <div>
                    <p className="text-xs font-semibold text-slate-800 leading-tight">{label}</p>
                    <p className="text-[11px] text-slate-400">{nota}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Donación de sangre */}
          <section>
            <h2 className="text-base font-bold mb-3 flex items-center gap-2">🩸 Donación de sangre</h2>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-900 space-y-1">
              <p className="font-semibold">Los hospitales necesitan sangre urgente. Si estás en Caracas:</p>
              <p>· Banco de Sangre Hospital Universitario: <strong>0212-693-1900</strong></p>
              <p>· Cruz Roja — Banco de Sangre: <strong>0212-571-1271</strong></p>
              <p>· Hospital Domingo Luciani (El Llanito): preguntar en admisión</p>
              <p className="text-xs text-red-700 mt-2">Grupos O+ y O− son los más necesarios en emergencias masivas.</p>
            </div>
          </section>

          {/* Personas desaparecidas — sitios especializados */}
          <section>
            <h2 className="text-base font-bold mb-1">🔎 Buscas a alguien desaparecido</h2>
            <p className="text-xs text-slate-500 mb-3">Estos sitios están especializados en registro de personas desaparecidas. Regístralo ahí para que más personas puedan ayudarte.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {sitiosExternos.map((s) => (
                <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer"
                  className="block bg-white border border-slate-200 rounded-xl p-4 hover:border-red-300 hover:shadow-sm transition-all">
                  <p className="text-sm font-semibold flex items-center gap-1.5">
                    {s.nombre} <ExternalLink size={12} className="text-slate-400" />
                  </p>
                  <p className="text-xs text-slate-500 mt-1 font-mono">{s.url.replace("https://", "")}</p>
                  <p className="text-sm text-slate-600 mt-2">{s.desc}</p>
                </a>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3">⚠️ Ninguna de estas plataformas verifica lo que reciben. Nunca paguen por información sobre una persona.</p>
          </section>

          {/* Contexto Venezuela */}
          <section>
            <h2 className="text-base font-bold mb-3 flex items-center gap-2">ℹ️ Información importante</h2>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <p className="font-semibold text-slate-700 mb-1">Comunicaciones interrumpidas</p>
                <p>Las fallas de señal Movilnet/Digitel/Movistar son frecuentes en emergencias. Si no logras llamar, busca zonas altas o espacios abiertos. CANTV fijo puede funcionar cuando el celular no.</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <p className="font-semibold text-slate-700 mb-1">Apagones eléctricos</p>
                <p>Carga tu teléfono donde haya electricidad. Muchos hospitales tienen planta eléctrica propia. Gasolineras y centros comerciales también pueden tener carga disponible.</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <p className="font-semibold text-slate-700 mb-1">Si un familiar fue traslado</p>
                <p>Los traslados entre hospitales son comunes cuando no hay capacidad. Llama siempre al hospital de destino y al de origen. Pregunta por el libro de traslados o la enfermería de guardia.</p>
              </div>
            </div>
          </section>

        </main>
      )}
    </div>
  );
}
