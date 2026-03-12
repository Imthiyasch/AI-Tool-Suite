const ytdl = require('@distube/ytdl-core');

async function test() {
    try {
        const info = await ytdl.getInfo('nOtbhE53nQY');
        
        const captions = info.player_response?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
        if (captions && captions.length > 0) {
            console.log("Found captions tracks:", captions.length);
            
            const firstTrackUrl = captions[0].baseUrl;
            const trackRes = await fetch(firstTrackUrl);
            const xml = await trackRes.text();
            console.log("Success! XML length:", xml.length);
        } else {
            console.log("No caption found");
        }
    } catch (e) {
        console.error(e);
    }
}
test();
