import vidsrc from '../providers/vidsrc.js';

export default async function handler(req, res) {
  const { title = "Oppenheimer", year = "2023" } = req.query;
  try {
    const searchResults = await vidsrc.search(title, year);
    if (!searchResults.length) {
      res.status(404).json({ message: "No results found!" });
      return;
    }
    const chosen = searchResults[0];
    const sources = await vidsrc.getSources(chosen.id);
    res.status(200).json({
      result: chosen,
      sources,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || error.toString() });
  }
}