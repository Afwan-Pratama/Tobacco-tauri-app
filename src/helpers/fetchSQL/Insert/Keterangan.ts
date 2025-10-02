import Database from "@tauri-apps/plugin-sql"

export async function sendKeterangan(
  tgl_masuk: string,
  tgl_pembelian: string,
  kode_id: number | undefined,
  total: number,
  bayar: number,
  sisa: number,
  wilayah_id: number | undefined
) {
  const db = await Database.load('sqlite:main.db')
  await db.execute(`
INSERT INTO Keterangan(
tgl_masuk,
tgl_pembelian,
kode_id,
total,
bayar,
sisa,
wilayah_id
)
VALUES ($1,$2,$3,$4,$5,$6,$7)
`, [
    tgl_masuk,
    tgl_pembelian,
    kode_id,
    total,
    bayar,
    sisa,
    wilayah_id
  ])
}
