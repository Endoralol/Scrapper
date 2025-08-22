import cheerio from "cheerio";

export default async function handler(req, res) {
    const { title, year } = req.query;

    if (!title) {
        return res.status(400).json({ error: "Missing 'title' query parameter." });
    }

    // Clean and encode search query
    const searchQuery = encodeURIComponent(`${title}${year ? " " + year : ""}`);
    const searchUrl = `https://vidsrc.to/search/${searchQuery}`;

    try {
        // Fetch search results page
        const searchResp = await fetch(searchUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; ScraperBot/1.0)"
            }
        });
        if (!searchResp.ok) throw new Error("Failed to fetch search results.");

        const searchHtml = await searchResp.text();
        const $ = cheerio.load(searchHtml);

        // Try to find the first matched movie card
        const movieCard = $(".video-block").first();
        if (!movieCard.length) {
            return res.status(404).json({ error: "Movie not found." });
        }

        const movieTitle = movieCard.find(".name").text().trim();
        const movieYear = movieCard.find(".meta span").first().text().trim();
        const moviePoster = movieCard.find("img").attr("src");
        const movieLink = movieCard.find("a").attr("href");

        if (!movieLink) {
            return res.status(404).json({ error: "Movie page link not found." });
        }

        // Fetch movie detail page to get streaming links
        const moviePageUrl = `https://vidsrc.to${movieLink}`;
        const movieResp = await fetch(moviePageUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; ScraperBot/1.0)"
            }
        });
        if (!movieResp.ok) throw new Error("Failed to fetch movie page.");

        const movieHtml = await movieResp.text();
        const $$ = cheerio.load(movieHtml);

        // Scrape streaming sources (all server tabs)
        const sources = [];
        $$('.server__list .server__item').each((i, el) => {
            const serverName = $$(el).find(".server__name").text().trim();
            const dataId = $$(el).attr("data-id");
            if (serverName && dataId) {
                sources.push({
                    server: serverName,
                    source_id: dataId
                });
            }
        });

        res.status(200).json({
            title: movieTitle,
            year: movieYear,
            poster: moviePoster,
            sources
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}