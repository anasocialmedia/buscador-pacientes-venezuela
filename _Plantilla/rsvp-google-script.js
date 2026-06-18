// ─────────────────────────────────────────────
//  RSVP Boda — Matías & Anamilé · 17.08.2026
//  Google Apps Script → pega esto en script.google.com
// ─────────────────────────────────────────────
//
//  PASOS:
//  1. Ve a https://script.google.com → Nuevo proyecto
//  2. Pega TODO este código (reemplaza lo que hay)
//  3. Cambia SHEET_ID por el ID de tu Google Sheet
//     (está en la URL: docs.google.com/spreadsheets/d/ESTE_ES_EL_ID/edit)
//  4. Clic en "Implementar" → "Nueva implementación"
//     → Tipo: Aplicación web
//     → Ejecutar como: Yo
//     → Quién tiene acceso: Cualquier persona
//  5. Copia la URL que aparece y pégala en invitacion-boda-civil.html
//     en la línea: const SCRIPT_URL = 'PEGA_AQUI_LA_URL';
// ─────────────────────────────────────────────

const SHEET_ID = 'PEGA_AQUI_EL_ID_DE_TU_GOOGLE_SHEET';
const SHEET_NAME = 'Confirmaciones';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SHEET_ID);

    let sheet = ss.getSheetByName(SHEET_NAME);

    // Crea la hoja y encabezados si no existe
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['Fecha', 'Nombre', 'Email', 'Asistencia', 'Alergias']);
      sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      data.fecha      || new Date().toLocaleString('es-CL'),
      data.nombre     || '—',
      data.email      || '—',
      data.asistencia || '—',
      data.alergias   || '—'
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// doGet permite verificar que el script está activo
function doGet() {
  return ContentService
    .createTextOutput('Script RSVP Matías & Anamilé activo ✦')
    .setMimeType(ContentService.MimeType.TEXT);
}
