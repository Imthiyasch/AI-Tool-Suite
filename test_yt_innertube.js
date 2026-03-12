const { Innertube } = require('youtubei.js');

async function test() {
    try {
        const youtube = await Innertube.create();
        const info = await youtube.getInfo('nOtbhE53nQY');
        
        const transcriptData = await info.getTranscript();
        if (transcriptData && transcriptData.transcript && transcriptData.transcript.content && transcriptData.transcript.content.body) {
            const segments = transcriptData.transcript.content.body.initial_segments;
            const fullText = segments.map(s => s.snippet.text).join(' ');
            console.log("Success! Items:", segments.length);
            console.log("Preview:", fullText.substring(0, 100));
        } else {
            console.log("No transcript data structure found");
        }
    } catch (e) {
        console.error("Error fetching with youtubei.js:");
        console.error(e);
    }
}
test();
