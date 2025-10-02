import Database from "@tauri-apps/plugin-sql";

interface bonusProps {
  id: number
  no: string
  created_date: string
  nama: string
  kode: string
  harga: number
  bruto: number
  netto: number
  jumlah_harga: number
  bonus: number
  jumlah_bonus: number
}

export async function getBonus() {
  const db = await Database.load('sqlite:main.db')
  return await db.select<bonusProps[]>(`
SELECT
Pembelian.id,
no,
created_date,
nama,
kode,
harga,
bruto,
netto,
jumlah_harga,
bonus,
(netto * bonus) AS jumlah_bonus
FROM Pembelian
INNER JOIN Kode_Pembelian
ON Pembelian.kode_id = Kode_Pembelian.id
`)
}

export async function getCustomBonus(id_w: number | undefined, id_k: number | undefined, date: string | undefined) {
  const db = await Database.load('sqlite:main.db')
  return await db.select<bonusProps[]>(`
SELECT
Pembelian.id,
created_date,
no,
nama,
kode,
harga,
bruto,
netto,
jumlah_harga,
bonus,
(netto * bonus) AS jumlah_bonus
FROM Pembelian
INNER JOIN Kode_Pembelian
ON Pembelian.kode_id = Kode_Pembelian.id
WHERE ${id_w != undefined ? 'Pembelian.wilayah_id = $1' : ''}
${id_w != undefined && id_k != undefined && date == '' ? 'AND' : ''}
${id_w != undefined && id_k == undefined && date != '' ? 'AND' : ''}
${id_w != undefined && id_k != undefined && date != '' ? 'AND' : ''}
${id_k != undefined ? 'Pembelian.kode_id = $2' : ''}
${id_k == undefined && id_k != undefined && date != '' ? 'AND' : ''}
${id_k != undefined && id_k != undefined && date != '' ? 'AND' : ''}
${date != '' ? 'created_date = $3' : ''}
`, [id_w, id_k, date])
}
