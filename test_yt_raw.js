async function test() {
    try {
        const videoId = 'nOtbhE53nQY';
        const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
        const html = await res.text();
        
        const match = html.match(/"captions":\s*({.*?})\s*,\s*"videoDetails"/);
        if (match) {
            const captions = JSON.parse(match[1]);
            const captionTracks = captions.playerCaptionsTracklistRenderer.captionTracks;
            console.log("Found captions tracks:", captionTracks.length);
            
            const firstTrackUrl = captionTracks[0].baseUrl;
            console.log("Fetching track URL...");
            const trackRes = await fetch(firstTrackUrl);
            const xml = await trackRes.text();
            console.log("Success! Characters length:", xml.length);
        } else {
            console.log("Captions block not found in HTML");
        }
    } catch (e) {
        console.error(e);
    }
}
test();
