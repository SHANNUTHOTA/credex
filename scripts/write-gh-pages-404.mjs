import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/credex";
const outDir = resolve(process.cwd(), "out");
const targetPath = resolve(outDir, "404.html");

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Redirecting...</title>
    <script>
      (function () {
        var basePath = ${JSON.stringify(basePath)};
        var pathname = window.location.pathname;
        if (pathname.length > 1 && pathname.charAt(pathname.length - 1) === '/') {
          pathname = pathname.slice(0, -1);
        }

        var remainder = pathname.indexOf(basePath) === 0 ? pathname.slice(basePath.length) : pathname;
        if (remainder.charAt(0) === '/') {
          remainder = remainder.slice(1);
        }
        var target = basePath + '/';

        if (remainder.indexOf('audit/') === 0) {
          var auditId = remainder.split('/')[1] || '';
          if (auditId) {
            target = basePath + '/?audit=' + encodeURIComponent(auditId);
          }
        }

        if (window.location.search) {
          target += window.location.search.charAt(0) === '?' ? '&' + window.location.search.slice(1) : window.location.search;
        }

        if (window.location.hash) {
          target += window.location.hash;
        }

        window.location.replace(target);
      })();
    </script>
  </head>
  <body></body>
</html>
`;

await mkdir(dirname(targetPath), { recursive: true });
await writeFile(targetPath, html, "utf8");
console.log(`Wrote ${targetPath}`);
