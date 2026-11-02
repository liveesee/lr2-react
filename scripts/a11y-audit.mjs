import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { chromium } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000"
const outDir = path.resolve(process.argv[2] ?? "a11y-report")

const scenarios = [
  { name: "Главная", url: "/" },
  {
    name: "Главная, открыты комментарии",
    url: "/",
    prepare: (page) => page.getByRole("button", { name: /Комментари/ }).first().click(),
  },
  { name: "Страница статьи", url: "/posts/olive-ink" },
  {
    name: "Страница статьи, пустой комментарий",
    url: "/posts/olive-ink",
    prepare: (page) => page.getByRole("button", { name: "Отправить" }).click(),
  },
]

const impactOrder = ["critical", "serious", "moderate", "minor"]

function escape(value) {
  return String(value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char])
}

function renderHtml(results) {
  const total = results.reduce((sum, item) => sum + item.violations.length, 0)
  const sections = results
    .map(({ name, url, violations }) => {
      const rows = violations
        .toSorted((a, b) => impactOrder.indexOf(a.impact) - impactOrder.indexOf(b.impact))
        .map(
          (violation) => `
          <tr>
            <td><span class="impact ${violation.impact}">${violation.impact}</span></td>
            <td><code>${escape(violation.id)}</code><br>${escape(violation.help)}</td>
            <td>${violation.nodes.length}</td>
            <td>${violation.nodes
              .slice(0, 3)
              .map((node) => `<code>${escape(node.target.join(" "))}</code>`)
              .join("<br>")}</td>
          </tr>`,
        )
        .join("")
      const body = violations.length
        ? `<table><tr><th>Важность</th><th>Правило</th><th>Узлов</th><th>Элементы</th></tr>${rows}</table>`
        : `<p class="ok">Нарушений не найдено</p>`
      return `<section><h2>${escape(name)} <small>${escape(url)}</small></h2>${body}</section>`
    })
    .join("")

  return `<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><title>Axe — FOLIA</title>
<style>
  body { font: 14px/1.45 -apple-system, "Segoe UI", sans-serif; margin: 32px; color: #1d1d1f; }
  h1 { margin: 0 0 4px; font-size: 24px; }
  h2 { margin: 28px 0 10px; font-size: 17px; }
  small { color: #555; font-weight: 400; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: left; vertical-align: top; }
  th { background: #f1f1f4; }
  code { font-size: 12px; }
  .impact { padding: 2px 8px; border-radius: 10px; color: #fff; font-size: 12px; }
  .critical { background: #b00020; } .serious { background: #c2410c; }
  .moderate { background: #8a6d00; } .minor { background: #555; }
  .ok { color: #116329; font-weight: 600; }
</style></head><body>
<h1>Отчёт axe-core (WCAG 2.1 A/AA + best practices)</h1>
<p>${escape(baseUrl)} · всего нарушений: <b>${total}</b> · ${new Date().toLocaleString("ru-RU")}</p>
${sections}
</body></html>`
}

const browser = await chromium.launch()
const results = []

for (const scenario of scenarios) {
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto(baseUrl + scenario.url, { waitUntil: "networkidle" })
  if (scenario.prepare) {
    await scenario.prepare(page)
    await page.waitForTimeout(300)
  }
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
    .analyze()
  results.push({ name: scenario.name, url: scenario.url, violations })
  await context.close()
}

await browser.close()
await mkdir(outDir, { recursive: true })
await writeFile(path.join(outDir, "axe.json"), JSON.stringify(results, null, 2))
await writeFile(path.join(outDir, "axe.html"), renderHtml(results))

for (const { name, violations } of results) {
  console.log(`\n${name}: ${violations.length}`)
  for (const violation of violations) {
    console.log(`  [${violation.impact}] ${violation.id} (${violation.nodes.length}) — ${violation.help}`)
  }
}
