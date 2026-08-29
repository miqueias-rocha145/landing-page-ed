import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const runtimeModules = process.env.ED_RUNTIME_NODE_MODULES;

if (!runtimeModules || !path.isAbsolute(runtimeModules)) {
  throw new Error("Defina ED_RUNTIME_NODE_MODULES com o caminho absoluto do runtime que contém o Sharp.");
}

const requireFromRuntime = createRequire(path.join(runtimeModules, "__ed_exporter__.cjs"));
const sharp = requireFromRuntime("sharp");

const paths = {
  template: path.join(projectRoot, "assets", "templates", "vaga-feed-1080x1350.svg"),
  data: path.join(projectRoot, "assets", "data", "vagas.js"),
  logo: path.join(projectRoot, "assets", "imgs", "logo-remove.png"),
  accent: path.join(projectRoot, "assets", "imgs", "vagas-acento.png"),
  plusJakarta: path.join(projectRoot, "assets", "css", "LDIoaomQNQcsA88c7O9yZ4KMCoOg4K_be25729b3d12.woff2"),
  geist: path.join(projectRoot, "assets", "css", "gyByhwUxId8gMEwcGFWNOITd_79e7a99c0e70.woff2"),
  vacancies: path.join(projectRoot, "assets", "vagas")
};

const toDataUri = (mime, buffer) => `data:${mime};base64,${buffer.toString("base64")}`;
const escapeXml = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

const splitCargo = (cargo) => {
  if (cargo.length <= 20) {
    return { line1: cargo, line2: "", y1: 365, size: cargo.length >= 19 ? 68 : 72 };
  }

  const words = cargo.split(/\s+/);
  let bestIndex = 1;
  let bestDifference = Number.POSITIVE_INFINITY;

  for (let index = 1; index < words.length; index += 1) {
    const first = words.slice(0, index).join(" ");
    const second = words.slice(index).join(" ");
    const difference = Math.abs(first.length - second.length);
    if (difference < bestDifference) {
      bestDifference = difference;
      bestIndex = index;
    }
  }

  const line1 = words.slice(0, bestIndex).join(" ");
  const line2 = words.slice(bestIndex).join(" ");
  const longestLine = Math.max(line1.length, line2.length);
  return { line1, line2, y1: 325, size: longestLine > 20 ? 62 : 68 };
};

const replaceTokens = (template, values) => Object.entries(values).reduce(
  (svg, [key, value]) => svg.replaceAll(`{{${key}}}`, escapeXml(value)),
  template
);

const dataSource = await fs.readFile(paths.data, "utf8");
const sandbox = { window: {} };
vm.runInNewContext(dataSource, sandbox, { filename: paths.data });
const allJobs = Array.isArray(sandbox.window.ED_VAGAS) ? sandbox.window.ED_VAGAS : [];
const requestedCode = process.argv.find((argument) => argument.startsWith("--codigo="))?.split("=")[1];
const jobs = allJobs.filter((job) => job?.ativa === true && (!requestedCode || job.codigo === requestedCode));

if (jobs.length === 0) throw new Error("Nenhuma vaga ativa encontrada para exportação.");

const [templateSource, logoBuffer, accentBuffer, plusJakartaBuffer, geistBuffer] = await Promise.all([
  fs.readFile(paths.template, "utf8"),
  fs.readFile(paths.logo),
  fs.readFile(paths.accent),
  fs.readFile(paths.plusJakarta),
  fs.readFile(paths.geist)
]);

const logoUri = toDataUri("image/png", logoBuffer);
const accentUri = toDataUri("image/png", accentBuffer);
const fontCss = `
      @font-face { font-family: "Plus Jakarta Sans"; src: url("${toDataUri("font/woff2", plusJakartaBuffer)}") format("woff2"); font-weight: 300 800; }
      @font-face { font-family: "Geist"; src: url("${toDataUri("font/woff2", geistBuffer)}") format("woff2"); font-weight: 300 700; }
`;

const template = templateSource
  .replace(/file:\/\/\/[^"\s]*logo-remove\.png/g, logoUri)
  .replace(/file:\/\/\/[^"\s]*vagas-acento\.png/g, accentUri)
  .replace("<style>", `<style>${fontCss}`);

await fs.mkdir(paths.vacancies, { recursive: true });

const exported = [];
for (const job of jobs) {
  if (!/^ED-\d{4}-\d{3}$/.test(job.codigo)) throw new Error(`Código inválido: ${job.codigo}`);
  if (!Array.isArray(job.responsabilidades) || job.responsabilidades.length !== 4) {
    throw new Error(`${job.codigo}: informe exatamente quatro atividades.`);
  }
  if (!Array.isArray(job.requisitos) || job.requisitos.length !== 4) {
    throw new Error(`${job.codigo}: informe exatamente quatro requisitos.`);
  }

  const tooLong = [...job.responsabilidades, ...job.requisitos].find((text) => String(text).length > 55);
  if (tooLong) throw new Error(`${job.codigo}: tópico acima de 55 caracteres: ${tooLong}`);

  const cargo = splitCargo(job.cargo);
  const configuredTemplate = template
    .replace(/(<text id="cargo-text"[^>]*\by=")[^"]+("\s)/, `$1${cargo.y1}$2`)
    .replace(/(<text id="cargo-text"[^>]*\bfont-size=")[^"]+("\s)/, `$1${cargo.size}$2`);
  const svg = replaceTokens(configuredTemplate, {
    CODIGO: job.codigo,
    CARGO_LINHA_1: cargo.line1.toUpperCase(),
    CARGO_LINHA_2: cargo.line2.toUpperCase(),
    CONTRATO: job.contrato,
    JORNADA: job.jornada,
    ATIVIDADE_1: job.responsabilidades[0],
    ATIVIDADE_2: job.responsabilidades[1],
    ATIVIDADE_3: job.responsabilidades[2],
    ATIVIDADE_4: job.responsabilidades[3],
    REQUISITO_1: job.requisitos[0],
    REQUISITO_2: job.requisitos[1],
    REQUISITO_3: job.requisitos[2],
    REQUISITO_4: job.requisitos[3]
  });

  const unresolved = svg.match(/{{[A-Z0-9_]+}}/g);
  if (unresolved) throw new Error(`${job.codigo}: campos não preenchidos: ${unresolved.join(", ")}`);

  const outputPath = path.resolve(projectRoot, job.imagemFeed);
  const allowedRoot = `${path.resolve(paths.vacancies)}${path.sep}`;
  if (!outputPath.startsWith(allowedRoot)) throw new Error(`Destino inválido: ${outputPath}`);

  await sharp(Buffer.from(svg), { density: 72, limitInputPixels: false })
    .resize(1080, 1350, { fit: "fill" })
    .flatten({ background: "#F3F8FC" })
    .toColourspace("srgb")
    .jpeg({ quality: 85, progressive: false })
    .toFile(outputPath);

  exported.push(path.relative(projectRoot, outputPath).replaceAll(path.sep, "/"));
}

console.log(JSON.stringify({ exported: exported.length, files: exported }, null, 2));
