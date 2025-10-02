import Database from "@tauri-apps/plugin-sql";

export async function updatePembelian(
  id: number,
  kode_id: number,
  no: string,
  nama: string,
  harga: number,
  bruto: number,
  netto: number,
  jumlah_harga: number,
  bonus: number,
  created_date: string
) {
  const db = await Database.load('sqlite:main.db')
  await db.execute(`
UPDATE Pembelian SET
kode_id = $1,
no = $2,
nama = $3,
harga = $4,
bruto = $5,
netto = $6,
jumlah_harga = $7,
bonus = $8,
created_date = $9
WHERE id = $10
`, [
    kode_id,
    no,
    nama,
    harga,
    bruto,
    netto,
    jumlah_harga,
    bonus,
    created_date,
    id
  ])
}

export async function updateKeteranganOnPembelian(id: number, keterangan_id: number) {
  const db = await Database.load('sqlite:main.db')
  await db.execute(`
UPDATE Pembelian SET
keterangan_id = $1
WHERE id = $2
`, [keterangan_id, id])
}
