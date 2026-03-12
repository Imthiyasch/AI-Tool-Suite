const { YoutubeTranscript } = require('youtube-transcript');

async function test() {
    try {
        const url = 'https://www.youtube.com/watch?v=kJQP7kiw5Fk'; // Generic video (Despacito or similar)
        const transcript = await YoutubeTranscript.fetchTranscript(url);
        console.log("Success, items:", transcript.length);
    } catch (e) {
        console.error("Error fetching:");
        console.error(e);
    }
}
test();
