import Database from "@tauri-apps/plugin-sql";
import { load } from "@tauri-apps/plugin-store";

interface biayaPembelian {
  administrasi: number
  pajak: number
  rokok: number
  mod_rokok: number
}

export async function startVariable() {

  const store = await load('settings.json')
  const db = await Database.load('sqlite:test.db')

  const biaya = store.get<biayaPembelian>('biaya_pembelian')

  if (biaya == undefined) {
    await store.set('biaya_pembelian', {
      administrasi: 80000,
      pajak: 1,
      rokok: 10000,
      mod_rokok: 1000000
    })
  }

  await db.execute('CREATE TABLE IF NOT EXISTS "Kode" ( "id" INTEGER, "kode" TEXT, "aktif" BOOLEAN,PRIMARY KEY("id" AUTOINCREMENT) );')
  await db.execute(`
CREATE TABLE IF NOT EXISTS "Wilayah" (
	"id"	INTEGER,
	"nama"	TEXT,
	"kondisi"	TEXT,
	"value_kondisi"	NUMERIC,
	"netto_kondisi"	NUMERIC,
	"netto_default"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);
`)
  await db.execute(`
CREATE TABLE IF NOT EXISTS "Pembelian" (
	"id"	INTEGER,
	"wilayah_id"	INTEGER,
	"kode_id"	INTEGER,
	"nama"	TEXT,
	"harga"	NUMERIC,
	"bruto"	NUMERIC,
	"netto"	NUMERIC,
	"jumlah_harga"	NUMERIC,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("kode_id") REFERENCES "Kode"("id"),
	FOREIGN KEY("wilayah_id") REFERENCES "Wilayah"("id")
);
`)
}
