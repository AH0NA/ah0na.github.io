Everything is in data/data.js (open it with Notepad). Put photos in this folder.

Option A (simplest, offline): edit data.js. Add a story block, add its photo. Done.

Option B (Google Sheet): make a sheet with columns  title | date | photo | text
  photo = file name in this folder (story4.jpg) or a full image link
  File > Share > Publish to web > pick the sheet + "CSV" > Publish > copy the link
  Paste the link into sheetUrl in data.js. Edits to the sheet show up on the site after a few minutes.
If the sheet can't be reached, the site falls back to the stories in data.js.
