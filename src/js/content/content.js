// misc.js: content script
async function main(params) {
    let data = await navigator.clipboard.readText();
    console.log(`Read clipboard: ${data}`)
    let processFunc = replace
    let processed = processFunc(data)
    await navigator.clipboard.writeText(processed);
    console.log(`Copied processed content: ${processed}`)
}
main()