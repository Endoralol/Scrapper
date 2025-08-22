# Vidsrc Scraper API

The Vidsrc Scraper API is a Node.js application designed to search and extract video sources from vidsrc.to for educational purposes. The repository contains a simple CLI scraper and is intended for Vercel deployment as an API.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Repository Setup and Dependencies
- **CRITICAL**: Fix package.json if needed - the file may contain literal `\n` characters instead of actual newlines which prevents npm install
- Install Node.js v20.19.4 or compatible version  
- Install dependencies: `npm install` -- takes ~1 second. NEVER CANCEL. Set timeout to 30+ seconds.
- Dependencies installed: axios ^1.6.0, cheerio ^1.0.0-rc.12

### Environment Requirements
- Node.js: v20.19.4 (tested version)
- npm: v10.8.2 (tested version)
- ES modules enabled (package.json has "type": "module")

### Build and Run
- **No build step required** - this is a pure Node.js application
- Run CLI version: `npm start` -- **WILL FAIL** due to missing providers/vidsrc.js module
- Run with custom parameters: `node index.js "Movie Title" 2023`

### Critical Missing Dependencies
**WARNING**: The application is incomplete and will not run successfully:
- Missing file: `providers/vidsrc.js` (required by index.js line 1)
- Missing directory: `api/` (referenced in README for Vercel deployment)
- No test suite, linting, or additional build processes exist

## Current Repository State

### File Structure
```
/
├── .gitignore          # Excludes node_modules, logs, build outputs
├── README.md           # Basic usage documentation  
├── package.json        # Node.js dependencies and scripts
└── index.js            # Main CLI application (incomplete)
```

### Available npm Scripts
- `start`: Runs `node index.js` (will fail due to missing dependencies)

## Validation

### What Works
- `npm install` completes successfully in ~1 second
- package.json parsing (after fixing literal \n characters)
- Node.js module loading up to the missing import

### What Does NOT Work
- **Application execution fails**: Missing `providers/vidsrc.js` module causes ERR_MODULE_NOT_FOUND
- **No API deployment structure**: Missing `api/` directory for Vercel deployment
- **No testing framework**: No test scripts or test files available

### Manual Testing Process
Since the application cannot run due to missing files:
1. Always run `npm install` first to verify dependencies install correctly
2. Test CLI execution with `npm start` to confirm the expected error: `Cannot find module '/path/to/providers/vidsrc.js'`
3. If working on the missing provider module, create the `providers/` directory and implement `vidsrc.js` with `search()` and `getSources()` methods

## Development Workflow

### Before Making Changes
- Run `npm install` to ensure dependencies are installed
- Verify Node.js version compatibility: `node --version` (should be v20+)
- Check current error state: `npm start` (expect module not found error)

### After Making Changes  
- **No linting available**: No ESLint, Prettier, or other code quality tools configured
- **No tests available**: No test suite to run for validation
- **Manual verification only**: Test any new code by running `npm start` or `node index.js`

### Common Development Tasks

#### Adding the Missing Provider Module
If implementing the missing `providers/vidsrc.js`:
1. Create directory: `mkdir providers`
2. Implement `providers/vidsrc.js` with ES module exports:
   ```javascript
   export default {
     async search(title, year) {
       // Implementation needed
       return [];
     },
     async getSources(id) {
       // Implementation needed  
       return [];
     }
   };
   ```

#### Adding Vercel API Structure
For Vercel deployment mentioned in README:
1. Create `api/` directory
2. Add `api/vidsrc.js` for serverless function
3. Implement query parameter handling for `title` and `year`

## Troubleshooting

### npm install fails with JSON parse error
The package.json file contains literal `\n` characters instead of newlines:
- **Solution**: Replace all `\n` with actual newline characters in package.json
- **Validation**: Run `npm install` - should complete in ~3-4 seconds

### Application fails with ERR_MODULE_NOT_FOUND
Expected behavior due to incomplete repository:
- **Error**: `Cannot find module './providers/vidsrc.js'`
- **Solution**: Implement missing provider module or comment out the import for testing

### No response from Vercel deployment
Missing API structure:
- **Issue**: README references `/api/vidsrc` endpoint but no `api/` directory exists
- **Solution**: Create Vercel serverless function structure in `api/` directory

## Repository Insights

### Timing Expectations
- Dependency installation: ~1 second (NEVER CANCEL - set 30+ second timeout)
- Application startup: Immediate failure due to missing module
- No long-running build or test processes

### Code Organization
- **Single entry point**: index.js handles CLI interface
- **Modular design**: Intended to use provider modules for different scraping sources
- **ES modules**: Uses import/export syntax (not CommonJS require)

### Deployment Intent
- **Primary target**: Vercel serverless deployment
- **Secondary use**: CLI tool for direct movie/show source extraction
- **Educational purpose**: Explicitly noted as educational/research tool only