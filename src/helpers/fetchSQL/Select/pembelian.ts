import Database from "@tauri-apps/plugin-sql"

interface pembelianProps {
  id: number
  no: string
  wilayah_id: number
  kode_id: string
  nama: string
  harga: number
  bruto: number
  netto: number
  jumlah_harga: number
  bonus: number
  created_date: string
}

export async function getPemWilKodNoSold(wilayah_id: number | undefined, kode_id: number | undefined) {
  const db = await Database.load('sqlite:main.db')
  return await db.select<pembelianProps[]>(`
select
pembelian.id,
wilayah_id,
kode_pembelian.kode AS kode_id,
no,
nama,
harga,
bruto,
netto,
jumlah_harga,
bonus,
created_date
from pembelian
inner join kode_pembelian
on pembelian.kode_id = kode_pembelian.id
where wilayah_id = $1 and sold = 0 and kode_id = $2`,
    [wilayah_id, kode_id])

}

export async function getPemKod(kode_id: number | undefined) {
  const db = await Database.load('sqlite:main.db')
  return await db.select<pembelianProps[]>(`
select
pembelian.id,
kode_pembelian.kode AS kode_id,
wilayah_id,
no,
nama,
harga,
bruto,
netto,
jumlah_harga,
bonus,
created_date
from pembelian
inner join kode_pembelian
on pembelian.kode_id = kode_pembelian.id
where kode_id = $1`,
    [kode_id])
}

export async function getCustomPemb(kode_id: number | undefined, wilayah_id: number | undefined, no: string | undefined) {
  const db = await Database.load('sqlite:main.db')
  return await db.select<pembelianProps[]>(`
select
pembelian.id,
kode_pembelian.kode AS kode_id,
wilayah_id,
no,
nama,
harga,
bruto,
netto,
jumlah_harga,
bonus,
created_date
from pembelian
inner join kode_pembelian
on pembelian.kode_id = kode_pembelian.id
where
${kode_id != undefined ? 'kode_id = $1' : ''}
${kode_id != undefined && (wilayah_id != undefined || no != '') ? 'AND' : ''}
${wilayah_id != undefined ? 'wilayah_id = $2' : ''}
${wilayah_id != undefined && no != '' ? 'AND' : ''}
${no != '' ? 'Pembelian.no = $3' : ''}
`,
    [kode_id, wilayah_id, no])
}

export async function getCustomKet(kode_id: number | undefined, wilayah_id: number | undefined, date: string) {
  const db = await Database.load('sqlite:main.db')
  return await db.select<pembelianProps[]>(`
select
pembelian.id,
kode_pembelian.kode AS kode_id,
wilayah_id,
no,
nama,
harga,
bruto,
netto,
jumlah_harga,
bonus,
created_date
from pembelian
inner join kode_pembelian
on pembelian.kode_id = kode_pembelian.id
where
keterangan_id IS NULL AND
${kode_id != undefined ? 'kode_id = $1' : ''}
${kode_id != undefined && (wilayah_id != undefined || date != '') ? 'AND' : ''}
${wilayah_id != undefined ? 'wilayah_id = $2' : ''}
${wilayah_id != undefined && date != '' ? 'AND' : ''}
${date != '' ? 'Pembelian.created_date = $3' : ''}
`,
    [kode_id, wilayah_id, date])
}
