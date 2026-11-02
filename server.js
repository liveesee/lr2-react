const express = require("express");
const helmet = require("helmet");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const port = Number(process.env.PORT) || 3000;

const app = next({ dev, webpack: true });
const handle = app.getRequestHandler();

const scriptSrc = ["'self'"];
// webpack dev server and React Refresh evaluate code at runtime
if (dev) scriptSrc.push("'unsafe-eval'");

const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc,
      scriptSrcAttr: ["'none'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
    },
  },
});

app.prepare().then(() => {
  const server = express();
  server.disable("x-powered-by");
  server.use(securityHeaders);
  server.use((req, res) => handle(req, res));
  server.listen(port, () => {
    console.log(`FOLIA: http://localhost:${port} (${dev ? "development" : "production"})`);
  });
});
