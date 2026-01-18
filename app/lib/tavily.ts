export async function performWebSearch(query: string) {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return null;

  try {
    console.log(`[Tavily] Searching for: ${query}`);
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        query: query,
        search_depth: "basic",
        include_answer: true,
        max_results: 5
      })
    });

    if (!response.ok) throw new Error(`Tavily Error: ${response.statusText}`);

    const data = await response.json();
    const context = data.results.map((result: any) => 
      `[Source: ${result.title}](${result.url}): ${result.content}`
    ).join('\n\n');

    return `WEB SEARCH INTELLIGENCE FOR "${query}":\n\n${context}\n\n`;
  } catch (error) {
    console.error("Web Search Failed:", error);
    return null;
  }
}
