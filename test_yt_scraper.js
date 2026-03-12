const { getSubtitles } = require('youtube-captions-scraper');

async function test() {
    try {
        const videoID = 'kJQP7kiw5Fk'; 
        const res = await getSubtitles({ videoID: videoID, lang: 'en' });
        console.log("Success, items:", res.length);
        console.log(res[0]);
    } catch (e) {
        console.error("Error fetching:");
        console.error(e);
    }
}
test();
