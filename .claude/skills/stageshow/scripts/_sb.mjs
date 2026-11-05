import { launch } from './browser.mjs'
const b = await launch()
for (const [id, w, out] of process.argv.slice(2).map(s => s.split('|'))) {
  const p = await b.newPage({ viewport: { width: +w, height: 900 }, deviceScaleFactor: 2 })
  await p.goto(`http://localhost:6006/iframe.html?id=${id}&viewMode=story`, { waitUntil: 'networkidle', timeout: 120000 })
  await p.waitForTimeout(1500)
  await p.screenshot({ path: out, fullPage: true })
}
await b.close()
