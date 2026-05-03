// ~/AgentAI/aiagent_frontend/server.js
const express = require("express");
const compression = require("compression");
const next = require("next");
const { parse } = require("url");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();
const PORT = Number(process.env.PORT || 3103);
const HOST = process.env.HOST || "127.0.0.1";

app.prepare().then(() => {
	const server = express();
	server.use(compression());

	// Let Next.js handle everything (pages, assets, API routes)
	server.use((req, res) => {
		const parsedUrl = parse(req.url, true);
		return handle(req, res, parsedUrl);
	});

	server.listen(PORT, HOST, (err) => {
		if (err) throw err;
		console.log(`> Next.js server running at http://${HOST}:${PORT}`);
	});
});
