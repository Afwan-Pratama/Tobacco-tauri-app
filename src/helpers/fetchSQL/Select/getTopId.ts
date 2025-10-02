import Database from "@tauri-apps/plugin-sql";

export async function getTopIdKeterangan() {
  const db = await Database.load('sqlite:main.db')
  return await db.select<{ id: number }[]>('SELECT id FROM Keterangan ORDER BY id DESC LIMIT 1')
}
