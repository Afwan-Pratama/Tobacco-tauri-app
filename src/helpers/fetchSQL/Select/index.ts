import Database from "@tauri-apps/plugin-sql"

export async function getKodePenjuAsLab() {
  const db = await Database.load('sqlite:main.db')
  return await db.select<{ id: number, label: string }[]>('SELECT id,kode AS label from Kode_Penjualan')
}

export async function getKodePembeAsLab() {
  const db = await Database.load('sqlite:main.db')
  return await db.select<{ id: number, label: string }[]>('SELECT id,kode AS label from Kode_Pembelian')
}

export async function getKodePenjualan() {
  const db = await Database.load('sqlite:main.db')
  return await db.select<{ id: number, kode: string }[]>('SELECT id,kode from Kode_Penjualan')
}

export async function getKodePembelian() {
  const db = await Database.load('sqlite:main.db')
  return await db.select<{ id: number, kode: string }[]>('SELECT id,kode from Kode_Pembelian')
}

export async function getWilayahOnly() {
  const db = await Database.load('sqlite:main.db')
  return await db.select<{ id: number, nama: string }[]>('SELECT id,nama FROM Wilayah')
}

export async function getWilayahOnlyLab() {
  const db = await Database.load('sqlite:main.db')
  return await db.select<{ id: number, label: string }[]>('SELECT id,nama AS label FROM Wilayah')
}

type wilayahProps = {
  id: number
  nama: string
  kondisi: string
  value_kondisi: number
  netto_kondisi: number
  netto_default: number
}

export async function getWilayah() {
  const db = await Database.load('sqlite:main.db')
  return await db.select<wilayahProps[]>('SELECT * FROM Wilayah')
}
