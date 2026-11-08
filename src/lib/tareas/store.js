import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

const FILE = path.join(process.cwd(), "data", "tareas.json");

const defaults = () => ({
  projects: [
    { id: randomUUID(), name: "Multicarnes", client: "Multicarnes", color: "#ef4444", deadline: null },
    { id: randomUUID(), name: "Apass Seguros", client: "Apass Seguros", color: "#3b82f6", deadline: null },
    { id: randomUUID(), name: "Marxel", client: "Marxel", color: "#10b981", deadline: null },
  ],
  tasks: [],
  settings: {
    phone: "3878630173",
    reminders: true,
    times: ["09:00", "18:00"],
    sent: {},
    log: [],
  },
});

export function read() {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    const d = defaults();
    write(d);
    return d;
  }
}

export function write(data) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

export const uid = () => randomUUID();
