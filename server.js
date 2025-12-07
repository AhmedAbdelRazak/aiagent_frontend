// ~/AgentAI/aiagent_frontend/server.js
const express = require("express");
const compression = require("compression");
const next = require("next");
const { parse } = require("url");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();
const PORT = 3103;

app.prepare().then(() => {
	const server = express();
	server.use(compression());

	// Let Next.js handle everything (pages, assets, API routes)
	server.all("/*", (req, res) => {
		const parsedUrl = parse(req.url, true);
		return handle(req, res, parsedUrl);
	});

	server.listen(PORT, (err) => {
		if (err) throw err;
		console.log(`> Next.js server running at http://localhost:${PORT}`);
	});
});
