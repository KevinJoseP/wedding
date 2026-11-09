/**
 * Kevin & Treesa — RSVP receiver.
 * Lives inside the "Wedding RSVPs" Google Sheet (Extensions → Apps Script)
 * and is deployed as a Web app. Each reply from the website becomes one row.
 */

var HEADERS = ['Received', 'Name(s)', 'Attending', 'Party size', 'Dietary notes', 'Blessing / message'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000); // two guests replying at once must not overwrite each other
  try {
    var data = JSON.parse(e.postData.contents);

    // Bots fill every field they find; real guests never see this one.
    if (data.website) return reply({ ok: true });

    var name = clean(data.name, 120);
    if (!name) return reply({ ok: false, error: 'missing name' });

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);

    sheet.appendRow([
      new Date(),
      name,
      data.attend === 'accept' ? 'Yes' : 'No',
      clean(data.count, 20),
      clean(data.diet, 300),
      clean(data.blessing, 2000)
    ]);
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Opening the web-app URL in a browser shows this, so you can tell it is deployed. */
function doGet() {
  return reply({ ok: true, service: 'Kevin & Treesa RSVP' });
}

/** Trim, cap the length, and stop a message being run as a spreadsheet formula. */
function clean(value, max) {
  var text = String(value == null ? '' : value).trim().slice(0, max);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function reply(body) {
  return ContentService.createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
