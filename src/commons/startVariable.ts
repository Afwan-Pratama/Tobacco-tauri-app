import Database from "@tauri-apps/plugin-sql";
import { load } from "@tauri-apps/plugin-store";

interface biayaPembelian {
  administrasi: number
  pajak: number
  rokok: number
  mod_rokok: number
}

async function execTable() {
  const db = await Database.load('sqlite:main.db')

  await db.execute(`
CREATE TABLE IF NOT EXISTS "Kode_Pembelian" (
	"id"	INTEGER,
	"kode"	TEXT,
	"aktif"	BOOLEAN,
	PRIMARY KEY("id" AUTOINCREMENT)
);
`)

  await db.execute(`
CREATE TABLE IF NOT EXISTS "Kode_Penjualan" (
	"id"	INTEGER,
	"kode"	TEXT,
	"aktif"	BOOLEAN,
	PRIMARY KEY("id" AUTOINCREMENT)
);
`)

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
CREATE TABLE IF NOT EXISTS "Keterangan" (
	"id"	INTEGER,
	"lunas"	NUMERIC DEFAULT 1,
	"total"	NUMERIC,
	"bayar"	NUMERIC,
	"sisa"	NUMERIC,
	"tgl_lunas"	TEXT,
	"tgl_pembelian"	TEXT,
	"wilayah_id"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("wilayah_id") REFERENCES "Wilayah"("id")
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
	"created_date"	TEXT,
	"sold"	INTEGER DEFAULT 0,
	"bonus"	NUMERIC,
	"no"	TEXT,
	"keterangan_id"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("keterangan_id") REFERENCES "Keterangan"("id"),
	FOREIGN KEY("kode_id") REFERENCES "Kode_Pembelian"("id"),
	FOREIGN KEY("wilayah_id") REFERENCES "Wilayah"("id")
);
`)
  await db.execute(`
CREATE TABLE IF NOT EXISTS "Penjualan" (
	"id"	INTEGER,
	"kode_id"	INTEGER,
	"pembelian_id"	INTEGER,
	"harga"	NUMERIC,
	"bruto"	NUMERIC,
	"netto"	NUMERIC,
	"jumlah_harga"	NUMERIC,
	"created_date"	INTEGER,
	"no"	TEXT,
	"wilayah_id"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("kode_id") REFERENCES "Kode_Penjualan"("id"),
	FOREIGN KEY("pembelian_id") REFERENCES "Pembelian"("id"),
	FOREIGN KEY("wilayah_id") REFERENCES "Wilayah"("id")
);`)


}

async function execDB() {
  const db = await Database.load('sqlite:main.db')

  await db.execute('INSERT INTO Wilayah(nama, kondisi, value_kondisi, netto_kondisi, netto_default) VALUES ($1,$2,$3,$4,$5)', ["Wonogiri", "tidak", 0, 0, 4])
  await db.execute('INSERT INTO Wilayah(nama, kondisi, value_kondisi, netto_kondisi, netto_default) VALUES ($1,$2,$3,$4,$5)', ["Weleri", "lebih", 55, 4, 3])

}

export async function startVariable() {

  const store = await load('settings.json')

  const biaya = await store.get<biayaPembelian>('biaya_pembelian')

  await execTable()

  if (biaya == undefined) {
    await store.set('biaya_pembelian', {
      administrasi: 80000,
      pajak: 1,
      rokok: 10000,
      mod_rokok: 1000000
    })
  }

  const firstTime = await store.get<boolean>('first_time')
  if (firstTime == undefined) {
    await store.set('first_time', false)
    execDB()
  }

}
