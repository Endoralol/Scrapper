import vidsrc from './providers/vidsrc.js';

async function searchAndExtract(title, year) {
  const searchResults = await vidsrc.search(title, year);
  if (searchResults.length === 0) {
    console.log('No results found!');
    return;
  }
  console.log('Search results:');
  searchResults.forEach((movie, i) => {
    console.log(`${i + 1}: ${movie.title} (${movie.year}) [${movie.id}]`);
  });

  // Pick the first result and get sources
  const chosen = searchResults[0];
  const sources = await vidsrc.getSources(chosen.id);
  console.log('Sources found:');
  sources.forEach((src, i) => {
    console.log(`${i + 1}: ${src.name} - ${src.embedUrl}`);
  });
}

const [,, ...args] = process.argv;
const title = args[0] || "Oppenheimer";
const year = args[1] || "2023";

searchAndExtract(title, year);