export const lib = {
  getCurrentTab: async function () {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  },

  readClipboard: async function (delay = 2000) {
    const data = await new Promise(resolve => setTimeout(async () => {
      const clipboard = await navigator.clipboard.readText();
      console.log(`read clipboard [${clipboard}]`);
      resolve(clipboard)
      //navigator.clipboard.readText().then(v => resolve(v))
    }, delay))
    return data
  },

  writeClipboard: async function (data) {
    await navigator.clipboard.writeText(data)
    console.log(`Copied processed content: ${data}`)
  }
}
