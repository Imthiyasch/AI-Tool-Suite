async function test() {
    process.env.FIRECRAWL_API_KEY = "fc-37f1933896434196a99ddea048bbedea";
    const videoUrl = 'https://www.youtube.com/watch?v=nOtbhE53nQY';
    
    try {
        const res = await fetch('https://api.firecrawl.dev/v1/scrape', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: videoUrl,
                formats: ['markdown'],
                onlyMainContent: true,
                waitFor: 5000 // wait for transcript to load if possible
            })
        });
        const data = await res.json();
        console.log("FireCrawl Scrape Success:", data?.data?.markdown?.substring(0, 200) || data);
    } catch (e) {
        console.error(e);
    }
}
test();
