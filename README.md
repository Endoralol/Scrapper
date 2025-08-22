# Vidsrc Scraper API

This project exposes a simple API for searching and extracting sources from vidsrc.to.  
**For educational purposes only!**

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/import?s=https://github.com/Endoralol/Scrapper)

## Usage

After deployment, call:

```
GET /api/vidsrc?title=Oppenheimer&year=2023
```

Returns JSON with:
- The best search result
- List of sources (iframe embed URLs)

## Example

```
GET https://your-vercel-app.vercel.app/api/vidsrc?title=Dune&year=2021
```

---
**Note:** Scraping public websites may be against their terms of service.
