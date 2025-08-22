import cheerio from "cheerio";
import fetch from "node-fetch";

// Ensure fetch is globally available (for some Vercel environments)
if (!globalThis.fetch) {
    globalThis.fetch = fetch;
}

export default async function handler(req, res) {
    const { title, year } = req.query;

    if (!title) {
        return res.status(400).json({ error: "Missing 'title' query parameter." });
    }

    const searchQuery = encodeURIComponent(`${title}${year ? " " + year : ""}`);
    const searchUrl = `https://vidsrc.to/search/${searchQuery}`;

    try {
        const searchResp = await fetch(searchUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; ScraperBot/1.0)"
            }
        });
        if (!searchResp.ok) throw new Error("Failed to fetch search results.");

        const searchHtml = await searchResp.text();
        const $ = cheerio.load(searchHtml);

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

        const moviePageUrl = `https://vidsrc.to${movieLink}`;
        const movieResp = await fetch(moviePageUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; ScraperBot/1.0)"
            }
        });
        if (!movieResp.ok) throw new Error("Failed to fetch movie page.");

        const movieHtml = await movieResp.text();
        const $$ = cheerio.load(movieHtml);

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
        // Log error for Vercel function logs
        console.error("API Error:", err);
        res.status(500).json({ error: err.message || "Unknown server error." });
    }
}
