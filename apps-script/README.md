# RSVP → Google Sheet

Replies from the website's RSVP card are sent to a small Google Apps Script,
which adds one row per reply to the **Kevin & Treesa — Wedding RSVPs** sheet.

## One-time set-up (about two minutes)

1. Open the sheet:
   https://docs.google.com/spreadsheets/d/1t83sadJLrd9NY8r9xB20aHFCNeC36__MSQgubmm682A/edit
2. Menu: **Extensions → Apps Script**. A code editor opens in a new tab.
3. Delete whatever is in the editor, paste the whole of [`Code.gs`](Code.gs), and press **Save** (the disk icon).
4. Click **Deploy → New deployment**. Click the gear icon beside "Select type" and choose **Web app**. Then set:
   - **Execute as:** Me
   - **Who has access:** Anyone
5. Click **Deploy**, then **Authorise access**, and choose your Google account.
   Google will warn that it "hasn't verified this app" — that is expected for a
   script you wrote yourself. Click **Advanced → Go to (project name) → Allow**.
6. Copy the **Web app URL** (it ends in `/exec`).
7. In `index.html`, find `var RSVP_ENDPOINT = '';` and paste the URL between the quotes.

To check the deployment, open the Web app URL in a browser: it should show
`{"ok":true,"service":"Kevin & Treesa RSVP"}`.

## Changing the script later

After editing `Code.gs` in the Apps Script editor, use
**Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**.
That keeps the same URL. Creating a brand-new deployment gives a different URL.

## Good to know

- The Web app URL is visible in the site's source, so anyone determined could
  post junk rows. The script caps field lengths, ignores bot submissions (a
  hidden field real guests never fill), and neutralises spreadsheet formulas.
  If junk ever appears, just delete those rows.
- Only people you share the sheet with can read the replies.
