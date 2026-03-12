const { transcript } = require('youtube-ext');

async function test() {
    try {
        const url = 'https://www.youtube.com/watch?v=kJQP7kiw5Fk'; 
        const res = await transcript(url);
        console.log("Success, text length:", res.text ? res.text.length : 0);
        console.log(res);
    } catch (e) {
        console.error("Error fetching transcript with youtube-ext:");
        console.error(e);
    }
}
test();
