import FirecrawlApp from '@mendable/firecrawl-js';

async function debugSearch() {
    const apiKey = "fc-37f1933896434196a99ddea048bbedea";
    const app = new FirecrawlApp({ apiKey });

    try {
        console.log("Starting search...");
        const searchResult = await app.search("Software Engineer jobs in San Francisco", {
            limit: 5,
        });
        
        console.log("Search Result Keys:", Object.keys(searchResult || {}));
        
        if (searchResult.web) {
            console.log("Found web results:", searchResult.web.length);
            console.log("First result:", JSON.stringify(searchResult.web[0], null, 2));
        } else {
            console.log("No web results found in object:", searchResult);
        }
    } catch (e) {
        console.error("Exception during search:", e);
    }
}

debugSearch();
