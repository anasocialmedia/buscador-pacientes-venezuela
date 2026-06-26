import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const dir = join(dirname(fileURLToPath(import.meta.url)), "buscador-pacientes");
const port = process.env.PORT || "5173";

const child = spawn(
  join(dir, "node_modules", ".bin", "vite"),
  ["--port", port],
  { cwd: dir, stdio: "inherit" }
);

child.on("exit", (code) => process.exit(code ?? 0));
