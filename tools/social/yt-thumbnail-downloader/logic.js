// Core Logic for YT Thumbnail Downloader
export async function execute(inputs) {
    const url = inputs.inputData || "";
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11}).*/);
    if (match) {
        const thumbUrl = "https://img.youtube.com/vi/" + match[1] + "/maxresdefault.jpg";
        return { outputData: "Thumbnail URL: " + thumbUrl, htmlPreview: `<img src="${thumbUrl}" alt="Thumbnail" style="max-width:100%"/>` };
    }
    return { outputData: "Invalid YouTube URL" };
}
export function validate(inputs) { return true; }
