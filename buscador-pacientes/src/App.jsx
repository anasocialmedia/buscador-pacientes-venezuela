import React, { useState, useMemo, useEffect } from "react";
import { Search, ExternalLink, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

// ---------- helpers ----------
const stripAccents = (s = "") => s.normalize("NFD").replace(/[̀-ͯ]/g, "");

// Phonetic normalization for Venezuelan name variations
const phoneticNorm = (s = "") => {
  return stripAccents(s)
    .toLowerCase()
    .replace(/ph/g, "f")        // sophia → sofia
    .replace(/th/g, "t")        // elizabeth → elizabet
    .replace(/ck/g, "k")
    .replace(/qu/g, "k")        // keila → keila
    .replace(/z/g, "s")         // zofia → sofia
    .replace(/v/g, "b")         // viviana → bibiana
    .replace(/y/g, "i")         // yolanda → iolanda
    .replace(/j/g, "h")         // jose → hose (loose)
    .replace(/x/g, "s")         // xavier → savier
    .replace(/ll/g, "i")        // guillermo → guiermo
    .replace(/h/g, "")          // silent h
    .replace(/(.)\1+/g, "$1")   // double letters → single
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, " ");
};

const normCedula = (s = "") => (s || "").replace(/[^\d]/g, "");
const fmtCedula = (c) => (c ? c.replace(/(\d)(?=(\d{3})+$)/g, "$1.") : "—");

// Levenshtein distance for fuzzy matching
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}

function fuzzyMatch(query, target) {
  if (!query) return true;
  const qNorm = phoneticNorm(query);
  const tNorm = phoneticNorm(target);
  // Exact or contains
  if (tNorm.includes(qNorm) || qNorm.includes(tNorm)) return true;
  // Word-level matching: each query word must match at least one target word
  const qWords = qNorm.split(" ").filter(Boolean);
  const tWords = tNorm.split(" ").filter(Boolean);
  return qWords.every(qw =>
    tWords.some(tw => {
      if (tw.includes(qw) || qw.includes(tw)) return true;
      const maxLen = Math.max(qw.length, tw.length);
      if (maxLen < 4) return qw === tw;
      const dist = levenshtein(qw, tw);
      return dist <= Math.floor(maxLen * 0.3); // 30% tolerance
    })
  );
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
  mk("Juan Carlos González", "", "10 años", H_AVILA, "Listado físico El Ávila", "Dx: Polit"),
  mk("Greisy Rodríguez", "", "20 años", H_AVILA, "Listado físico El Ávila", ""),
  mk("Juan González", "", "16 años", H_AVILA, "Listado físico El Ávila", "Asmático"),
  mk("Grecia Rodríguez", "", "36 años", H_AVILA, "Listado físico El Ávila", "Dx: Tx musculoesquelético"),
  mk("Miguel Millán", "", "38 años", H_AVILA, "Listado físico El Ávila", "Dx: Tx musculoesquelético"),
  mk("Furgencia Millán", "", "58 años", H_AVILA, "Listado físico El Ávila", "Diabético · Dx: Tx musculoesquelético"),
  mk("Sonia González", "", "20 años", H_AVILA, "Listado físico El Ávila", "Dx: Tx musculoesquelético"),
  mk("Moraima González", "", "65 años", H_AVILA, "Listado físico El Ávila", "Espondioloartritis · Dx: Tx craneoencefálico / herida"),
  mk("Frenesi Bemítez", "", "31 años", H_AVILA, "Listado físico El Ávila", "Dx: Tx craneoencefálico"),
  mk("Hasem Salah", "", "62 años", H_AVILA, "Listado físico El Ávila", "Dx: Tx craneoencefálico"),
  mk("Bruno Romero", "", "87 años", H_AVILA, "Listado físico El Ávila", "Dx: Polit"),
  mk("Ricardo Bodul", "", "63 años", H_AVILA, "Listado físico El Ávila", ""),
  mk("Victoria Delgado", "", "19 años", H_AVILA, "Listado físico El Ávila", ""),
  mk("Johani Aguilar", "", "43 años", H_AVILA, "Listado físico El Ávila", ""),
  mk("Nicollete Nuovo", "", "77 años", H_AVILA, "Listado físico El Ávila", "Dx: Fractura pelvis / Fx astrágalo"),
  mk("José Luis Costa", "", "16 años", H_AVILA, "Listado físico El Ávila", ""),
  mk("Bárbara Morillo", "", "", H_AVILA, "Listado físico El Ávila", "Dx: Polit región / Tx rodilla"),
  mk("Ana Jalongo", "", "86 años", H_AVILA, "Listado físico El Ávila", "Alergia: mariscos/aspirina · Dx: Traumatismo contuso"),
  // Items 26-51
  mk("Marbelis Gino", "", "28 años", H_AVILA, "Listado físico El Ávila", "Dx: HTA / ansiedad"),
  mk("Erik Monterey Santo", "", "52 años", H_AVILA, "Listado físico El Ávila", ""),
  mk("Maribel Aguilera", "", "32 años", H_AVILA, "Listado físico El Ávila", "Sx convulsivo"),
  mk("Gabriel González", "", "82 años", H_AVILA, "Listado físico El Ávila", "Dx: Esguince tobillo izquierdo"),
  mk("Yoani González", "", "58 años", H_AVILA, "Listado físico El Ávila", "Dx: Polit"),
  mk("Graciela González", "", "88 años", H_AVILA, "Listado físico El Ávila", "Dx: Tx musculoesquelético / síndrome compartimental"),
  mk("Alejandro Morillo", "", "22 años", H_AVILA, "Listado físico El Ávila", "Dx: Tx musculoesquelético"),
  mk("Vanesa Mero", "", "30 años", H_AVILA, "Listado físico El Ávila", ""),
  mk("Sofia González", "", "8 años", H_AVILA, "Listado físico El Ávila", "Dx: Tx musculoesquelético"),
  mk("Juan Miguel González", "", "10 años", H_AVILA, "Listado físico El Ávila", "Dx: Tx tobillo izquierdo"),
  mk("María Alejandra Rodríguez", "", "45 años", H_AVILA, "Listado físico El Ávila", "Dx: Tx musculoesquelético"),
  mk("Marta Nova", "", "37 años", H_AVILA, "Listado físico El Ávila", ""),
  mk("Greisly Prado", "", "15 años", H_AVILA, "Listado físico El Ávila", "Dx: Fx costal / Fx esternal-costal"),
  mk("María Fernanda Lovera", "", "28 años", H_AVILA, "Listado físico El Ávila", "Dx: Tx mano izquierda"),
  mk("Leandro González", "27027480", "28 años", H_AVILA, "Listado físico El Ávila", ""),
  mk("Marialy Marcano", "6498112", "58 años", H_AVILA, "Listado físico El Ávila", ""),
  mk("Elias Baladín", "6480632", "62 años", H_AVILA, "Listado físico El Ávila", "Alérgico a sulfa · Dx: Escoriaciones"),
  mk("Ricardo González", "3152093", "20 años", H_AVILA, "Listado físico El Ávila", "Dx: HTA"),
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
  mk("Lalongo De Basillo", "814181", "87 años", H_AVILA, "Listado físico El Ávila", "Dx: Polit", "INGRESO"),
  mk("Donato Enro", "4565942", "70 años", H_AVILA, "Listado físico El Ávila", "Dx: Polit inestabilidad hemodinámica"),
  mk("Hamping Feng", "83812553", "35 años", H_AVILA, "Listado físico El Ávila", "Dx: Polit / esguince pie izquierdo"),
  mk("Karin Aguilar", "6123953", "65 años", H_AVILA, "Listado físico El Ávila", "Dx: Polit"),
  mk("Laura Marquina", "17323315", "42 años", H_AVILA, "Listado físico El Ávila", "Dx: Politraumatismo"),
  // Items 63+ (parcialmente legibles en foto 2 El Ávila)
  mk("Pablo González", "1868258", "88 años", H_AVILA, "Listado físico El Ávila", "Dx: TCE (datos parciales — verificar original)"),

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
  mk("Briceño Mirabal Josefina", "3970281", "77 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Catia"),
  mk("Luca González Yamilet", "13610512", "49 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Artigas"),
  mk("Montilla Zelaya Herrera", "6285593", "54 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: San Martín"),
  mk("Barrios Yolanda", "5323419", "77 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: San Martín"),
  mk("Álvarez Bermo Elsy", "11697809", "53 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: San Martín"),
  mk("Brito Alvarado Camila", "32730226", "17 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Macuto"),
  mk("Dorta Rodríguez Delia", "6124942", "92 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Quinta Crespo"),
  mk("Coen Blanco", "5013048", "66 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: San Martín"),
  mk("Morillo Hernández Nehomar", "15280448", "45 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Comandancia"),
  mk("Murillo Landaeta Yorgelis Yadil", "28440024", "26 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: San Martín"),
  mk("Castro Lauriana", "867005", "66 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira"),
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
  mk("Milans Gladys", "5114187", "68 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: Artigas"),
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
  mk("Piñero Díaz Oukli", "29910706", "23 años", H_ARVELO, "Lista Contingencia 24JUN26", "Proc: La Guaira", "Fallecido — según lista oficial"),
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

// Merge all patient arrays
const pacientesAll = [...pacientes, ...arvelo];

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
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState("buscar");

  useEffect(() => { setPage(1); }, [query]);

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const cedQ = normCedula(query);
    return pacientesAll.filter((r) => {
      if (cedQ.length >= 4 && normCedula(r.cedula).includes(cedQ)) return true;
      return fuzzyMatch(query, r.nombre);
    });
  }, [query]);

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
          className="text-xs text-slate-400 hover:text-white transition-colors"
        >
          {tab === "buscar" ? "Otros recursos →" : "← Buscador"}
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
            <p className="text-slate-400 text-xs mt-2">{pacientesAll.length} registros de {new Set(pacientesAll.map(p => p.hospital)).size} hospitales</p>
          </header>

          {/* Buscador */}
          <div className="max-w-2xl mx-auto px-4 -mt-8 relative z-10">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-3">
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar por nombre, apellido o cédula…"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 text-base focus:outline-none focus:ring-2 focus:ring-red-600 bg-slate-50"
                  autoFocus
                />
              </div>
            </div>
          </div>

          {/* Resultados */}
          <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            {!query.trim() && (
              <div className="text-center py-16 text-slate-400">
                <Search size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Escribe un nombre o cédula para buscar</p>
              </div>
            )}

            {query.trim() && filtered.length === 0 && (
              <div className="text-center py-16 text-slate-400">
                <p className="text-sm font-medium">No se encontraron coincidencias para <span className="font-bold text-slate-600">"{query}"</span></p>
                <p className="text-xs mt-2">Intenta con otro nombre, apellido o número de cédula</p>
              </div>
            )}

            {filtered.length > 0 && (
              <>
                <p className="text-xs text-slate-500 mb-4">
                  {filtered.length} resultado{filtered.length !== 1 ? "s" : ""} para "<span className="font-semibold">{query}</span>"
                  {totalPages > 1 && ` · página ${page} de ${totalPages}`}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {pageData.map((r) => (
                    <div key={r.id} className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-2 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-sm leading-tight">{r.nombre}</p>
                        {r.estado && (
                          <span className={`shrink-0 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            /defunci|fallec/i.test(r.estado) ? "bg-red-100 text-red-700"
                            : /alta/i.test(r.estado) ? "bg-emerald-100 text-emerald-700"
                            : "bg-blue-100 text-blue-700"
                          }`}>{r.estado}</span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 space-y-1">
                        <p className="flex items-center gap-1"><MapPin size={10} className="shrink-0" /> {r.hospital}</p>
                        <div className="flex gap-3">
                          <span><span className="text-slate-400">CI:</span> <span className="font-mono">{fmtCedula(r.cedula) !== "—" ? fmtCedula(r.cedula) : "—"}</span></span>
                          {r.edad && <span><span className="text-slate-400">Edad:</span> {parseInt(r.edad) < 18 ? "Menor de edad" : r.edad}</span>}
                        </div>
                        {r.notas && <p className="text-amber-700 leading-snug">{r.notas}</p>}
                      </div>
                    </div>
                  ))}
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
        <main className="max-w-3xl mx-auto px-4 py-10">
          <h2 className="text-lg font-bold mb-1">Otros recursos</h2>
          <p className="text-sm text-slate-500 mb-6">Iniciativas ciudadanas. Ninguna verifica lo que reciben — nunca den dinero a cambio de información.</p>
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
        </main>
      )}
    </div>
  );
}
