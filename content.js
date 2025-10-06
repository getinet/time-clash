function parseTime(timeStr) {
  // Convert "9:00pm" to minutes since midnight
  const match = timeStr.match(/(\d{1,2}):(\d{2})(am|pm)/i);
  if (!match) return null;
  let [_, hours, minutes, ampm] = match;
  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);
  if (ampm.toLowerCase() === 'pm' && hours !== 12) hours += 12;
  if (ampm.toLowerCase() === 'am' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function findOverlaps() {
  const entries = [];
  document.querySelectorAll('tr[id^="timesheet_day_entry_"]').forEach(row => {
    const startEl = row.querySelector('.entry-timestamp-start');
    const endEl = row.querySelector('.entry-timestamp-end');
    if (startEl && endEl) {
      const start = parseTime(startEl.textContent.trim());
      const end = parseTime(endEl.textContent.trim());
      if (start !== null && end !== null) {
        entries.push({ row, start, end });
      }
    }
  });

  // Clear previous highlights
  entries.forEach(e => e.row.style.backgroundColor = '');

  // Compare each entry with others
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const a = entries[i];
      const b = entries[j];
      if (a.start < b.end && b.start < a.end) {
        // Overlap detected
        a.row.style.backgroundColor = '#ffcccc';
        b.row.style.backgroundColor = '#ffcccc';
      }
    }
  }
}

function waitForHarvestContent() {
  const observer = new MutationObserver(() => {
    if (document.querySelector('.entry-timestamp-start')) {
      observer.disconnect();
      findOverlaps();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', waitForHarvestContent);
} else {
  waitForHarvestContent();
}
