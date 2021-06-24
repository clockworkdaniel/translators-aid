document
  .getElementById("render-highlights-button")
  .addEventListener("click", () => {
    const minLength = document.getElementById("min-length-input").value;
    const maxLength = document.getElementById("max-length-input").value;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        method: "renderHighlights",
        minLength,
        maxLength,
      });
    });
  });

document
  .getElementById("remove-highlights-button")
  .addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        method: "removeHighlights",
      });
    });
  });
