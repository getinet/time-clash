document.getElementById("checkBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      if (typeof checkForOverlaps === "function") {
        checkForOverlaps();
      } else {
        alert("This page does not appear to be a Harvest timesheet.");
      }
    }
  });
});