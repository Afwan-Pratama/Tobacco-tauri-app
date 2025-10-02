import Database from "@tauri-apps/plugin-sql"

interface labaRugiProps {
  id: number
  no: string
  kode: string
  harga: number
  bruto: number
  netto: number
  jumlah_harga: number
  harga_beli: number
  bruto_beli: number
  netto_beli: number
  jumlah_beli: number
  no_beli: string
  kode_beli: string
  selisih_harga: number
  selisih_bruto: number
  selisih_netto: number
  selisih_jumlah: number
}

export async function getLabaRugi() {
  const db = await Database.load('sqlite:main.db')
  return await db.select<labaRugiProps[]>(`
SELECT
Penjualan.id,
Penjualan.no,
Kode_Penjualan.kode,
Penjualan.harga,
Penjualan.bruto,
Penjualan.netto,
Penjualan.jumlah_harga,
Pembelian.no_beli,
Pembelian.harga_beli,
Pembelian.bruto_beli,
Pembelian.netto_beli,
Pembelian.jumlah_beli,
Pembelian.kode_beli,
(Penjualan.harga - Pembelian.harga_beli) AS selisih_harga,
(Penjualan.netto - Pembelian.netto_beli) AS selisih_netto,
(Penjualan.bruto - Pembelian.bruto_beli) AS selisih_bruto,
(Penjualan.jumlah_harga - Pembelian.jumlah_beli) AS selisih_jumlah
FROM Penjualan
INNER JOIN
	(SELECT
	Pem.id,
	Pem.no AS no_beli,
	Pem.harga AS harga_beli,
	Pem.bruto AS bruto_beli,
	Pem.netto AS netto_beli,
	Pem.jumlah_harga AS jumlah_beli,
	KPem.kode AS kode_beli
	FROM Pembelian AS Pem
		INNER JOIN
		Kode_Pembelian AS Kpem
		ON Pem.kode_id = KPem.id) AS Pembelian
ON Penjualan.pembelian_id = Pembelian.id
INNER JOIN Kode_Penjualan
ON Penjualan.kode_id = Kode_Penjualan.id
`)

}

export async function getLabaNo(v: string) {
  const db = await Database.load('sqlite:main.db')
  return await db.select<labaRugiProps[]>(`
SELECT
Penjualan.id,
Penjualan.no,
Kode_Penjualan.kode,
Penjualan.harga,
Penjualan.bruto,
Penjualan.netto,
Penjualan.jumlah_harga,
Pembelian.no_beli,
Pembelian.harga_beli,
Pembelian.bruto_beli,
Pembelian.netto_beli,
Pembelian.jumlah_beli,
Pembelian.kode_beli,
(Penjualan.harga - Pembelian.harga_beli) AS selisih_harga,
(Penjualan.netto - Pembelian.netto_beli) AS selisih_netto,
(Penjualan.bruto - Pembelian.bruto_beli) AS selisih_bruto,
(Penjualan.jumlah_harga - Pembelian.jumlah_beli) AS selisih_jumlah
FROM Penjualan
INNER JOIN
	(SELECT
	Pem.id,
	Pem.no AS no_beli,
	Pem.harga AS harga_beli,
	Pem.bruto AS bruto_beli,
	Pem.netto AS netto_beli,
	Pem.jumlah_harga AS jumlah_beli,
	KPem.kode AS kode_beli
	FROM Pembelian AS Pem
		INNER JOIN
		Kode_Pembelian AS Kpem
		ON Pem.kode_id = KPem.id) AS Pembelian
ON Penjualan.pembelian_id = Pembelian.id
INNER JOIN Kode_Penjualan
ON Penjualan.kode_id = Kode_Penjualan.id
WHERE Penjualan.no = $1 OR Pembelian.no_beli = $1
`,
    [v])
}

export async function getLabaKoPenj(v: number | undefined) {
  const db = await Database.load('sqlite:main.db')
  return await db.select<labaRugiProps[]>(`
SELECT
Penjualan.id,
Penjualan.no,
Kode_Penjualan.kode,
Penjualan.harga,
Penjualan.bruto,
Penjualan.netto,
Penjualan.jumlah_harga,
Pembelian.no_beli,
Pembelian.harga_beli,
Pembelian.bruto_beli,
Pembelian.netto_beli,
Pembelian.jumlah_beli,
Pembelian.kode_beli,
(Penjualan.harga - Pembelian.harga_beli) AS selisih_harga,
(Penjualan.netto - Pembelian.netto_beli) AS selisih_netto,
(Penjualan.bruto - Pembelian.bruto_beli) AS selisih_bruto,
(Penjualan.jumlah_harga - Pembelian.jumlah_beli) AS selisih_jumlah
FROM Penjualan
INNER JOIN
	(SELECT
	Pem.id,
	Pem.no AS no_beli,
	Pem.harga AS harga_beli,
	Pem.bruto AS bruto_beli,
	Pem.netto AS netto_beli,
	Pem.jumlah_harga AS jumlah_beli,
	KPem.kode AS kode_beli
	FROM Pembelian AS Pem
		INNER JOIN
		Kode_Pembelian AS Kpem
		ON Pem.kode_id = KPem.id) AS Pembelian
ON Penjualan.pembelian_id = Pembelian.id
INNER JOIN Kode_Penjualan
ON Penjualan.kode_id = Kode_Penjualan.id
WHERE Penjualan.kode_id = $1
`,
    [v])

}

export async function getLabaKoPemb(v: number | undefined) {
  const db = await Database.load('sqlite:main.db')
  return await db.select<labaRugiProps[]>(`
SELECT
Penjualan.id,
Penjualan.no,
Kode_Penjualan.kode,
Penjualan.harga,
Penjualan.bruto,
Penjualan.netto,
Penjualan.jumlah_harga,
Pembelian.no_beli,
Pembelian.harga_beli,
Pembelian.bruto_beli,
Pembelian.netto_beli,
Pembelian.jumlah_beli,
Pembelian.kode_beli,
(Penjualan.harga - Pembelian.harga_beli) AS selisih_harga,
(Penjualan.netto - Pembelian.netto_beli) AS selisih_netto,
(Penjualan.bruto - Pembelian.bruto_beli) AS selisih_bruto,
(Penjualan.jumlah_harga - Pembelian.jumlah_beli) AS selisih_jumlah
FROM Penjualan
INNER JOIN
	(SELECT
	Pem.id,
	Pem.kode_id AS kode_id_pembelian,
	Pem.no AS no_beli,
	Pem.harga AS harga_beli,
	Pem.bruto AS bruto_beli,
	Pem.netto AS netto_beli,
	Pem.jumlah_harga AS jumlah_beli,
	KPem.kode AS kode_beli
	FROM Pembelian AS Pem
		INNER JOIN
		Kode_Pembelian AS Kpem
		ON Pem.kode_id = KPem.id) AS Pembelian
ON Penjualan.pembelian_id = Pembelian.id
INNER JOIN Kode_Penjualan
ON Penjualan.kode_id = Kode_Penjualan.id
WHERE Pembelian.kode_id_pembelian = $1
`,
    [v])

}

export async function getLabaWil(w: number | undefined) {
  const db = await Database.load('sqlite:main.db')
  return await db.select<labaRugiProps[]>(`
SELECT
Penjualan.id,
Penjualan.no,
Kode_Penjualan.kode,
Penjualan.harga,
Penjualan.bruto,
Penjualan.netto,
Penjualan.jumlah_harga,
Pembelian.no_beli,
Pembelian.harga_beli,
Pembelian.bruto_beli,
Pembelian.netto_beli,
Pembelian.jumlah_beli,
Pembelian.kode_beli,
(Penjualan.harga - Pembelian.harga_beli) AS selisih_harga,
(Penjualan.netto - Pembelian.netto_beli) AS selisih_netto,
(Penjualan.bruto - Pembelian.bruto_beli) AS selisih_bruto,
(Penjualan.jumlah_harga - Pembelian.jumlah_beli) AS selisih_jumlah
FROM Penjualan
INNER JOIN
	(SELECT
	Pem.id,
	Pem.no AS no_beli,
	Pem.harga AS harga_beli,
	Pem.bruto AS bruto_beli,
	Pem.netto AS netto_beli,
	Pem.jumlah_harga AS jumlah_beli,
	KPem.kode AS kode_beli
	FROM Pembelian AS Pem
		INNER JOIN
		Kode_Pembelian AS Kpem
		ON Pem.kode_id = KPem.id) AS Pembelian
ON Penjualan.pembelian_id = Pembelian.id
INNER JOIN Kode_Penjualan
ON Penjualan.kode_id = Kode_Penjualan.id
WHERE Penjualan.wilayah_id = $1
`, [w])

}


export async function getLabaNoWil(v: string, w: number | undefined) {
  const db = await Database.load('sqlite:main.db')
  return await db.select<labaRugiProps[]>(`
SELECT
Penjualan.id,
Penjualan.no,
Kode_Penjualan.kode,
Penjualan.harga,
Penjualan.bruto,
Penjualan.netto,
Penjualan.jumlah_harga,
Pembelian.no_beli,
Pembelian.harga_beli,
Pembelian.bruto_beli,
Pembelian.netto_beli,
Pembelian.jumlah_beli,
Pembelian.kode_beli,
(Penjualan.harga - Pembelian.harga_beli) AS selisih_harga,
(Penjualan.netto - Pembelian.netto_beli) AS selisih_netto,
(Penjualan.bruto - Pembelian.bruto_beli) AS selisih_bruto,
(Penjualan.jumlah_harga - Pembelian.jumlah_beli) AS selisih_jumlah
FROM Penjualan
INNER JOIN
	(SELECT
	Pem.id,
	Pem.no AS no_beli,
	Pem.harga AS harga_beli,
	Pem.bruto AS bruto_beli,
	Pem.netto AS netto_beli,
	Pem.jumlah_harga AS jumlah_beli,
	KPem.kode AS kode_beli
	FROM Pembelian AS Pem
		INNER JOIN
		Kode_Pembelian AS Kpem
		ON Pem.kode_id = KPem.id) AS Pembelian
ON Penjualan.pembelian_id = Pembelian.id
INNER JOIN Kode_Penjualan
ON Penjualan.kode_id = Kode_Penjualan.id
WHERE Penjualan.wilayah_id = $1 (Penjualan.no = $2 OR Pembelian.no_beli = $2)
`,
    [w, v])
}

export async function getLabaKoPenjWil(v: number | undefined, w: number | undefined) {
  const db = await Database.load('sqlite:main.db')
  return await db.select<labaRugiProps[]>(`
SELECT
Penjualan.id,
Penjualan.no,
Kode_Penjualan.kode,
Penjualan.harga,
Penjualan.bruto,
Penjualan.netto,
Penjualan.jumlah_harga,
Pembelian.no_beli,
Pembelian.harga_beli,
Pembelian.bruto_beli,
Pembelian.netto_beli,
Pembelian.jumlah_beli,
Pembelian.kode_beli,
(Penjualan.harga - Pembelian.harga_beli) AS selisih_harga,
(Penjualan.netto - Pembelian.netto_beli) AS selisih_netto,
(Penjualan.bruto - Pembelian.bruto_beli) AS selisih_bruto,
(Penjualan.jumlah_harga - Pembelian.jumlah_beli) AS selisih_jumlah
FROM Penjualan
INNER JOIN
	(SELECT
	Pem.id,
	Pem.no AS no_beli,
	Pem.harga AS harga_beli,
	Pem.bruto AS bruto_beli,
	Pem.netto AS netto_beli,
	Pem.jumlah_harga AS jumlah_beli,
	KPem.kode AS kode_beli
	FROM Pembelian AS Pem
		INNER JOIN
		Kode_Pembelian AS Kpem
		ON Pem.kode_id = KPem.id) AS Pembelian
ON Penjualan.pembelian_id = Pembelian.id
INNER JOIN Kode_Penjualan
ON Penjualan.kode_id = Kode_Penjualan.id
WHERE Penjualan.kode_id = $1 AND Penjualan.wilayah_id = $2
`,
    [v, w])

}

export async function getLabaKoPembWil(v: number | undefined, w: number | undefined) {
  const db = await Database.load('sqlite:main.db')
  return await db.select<labaRugiProps[]>(`
SELECT
Penjualan.id,
Penjualan.no,
Kode_Penjualan.kode,
Penjualan.harga,
Penjualan.bruto,
Penjualan.netto,
Penjualan.jumlah_harga,
Pembelian.no_beli,
Pembelian.harga_beli,
Pembelian.bruto_beli,
Pembelian.netto_beli,
Pembelian.jumlah_beli,
Pembelian.kode_beli,
(Penjualan.harga - Pembelian.harga_beli) AS selisih_harga,
(Penjualan.netto - Pembelian.netto_beli) AS selisih_netto,
(Penjualan.bruto - Pembelian.bruto_beli) AS selisih_bruto,
(Penjualan.jumlah_harga - Pembelian.jumlah_beli) AS selisih_jumlah
FROM Penjualan
INNER JOIN
	(SELECT
	Pem.id,
	Pem.kode_id AS kode_id_pembelian,
	Pem.no AS no_beli,
	Pem.harga AS harga_beli,
	Pem.bruto AS bruto_beli,
	Pem.netto AS netto_beli,
	Pem.jumlah_harga AS jumlah_beli,
	KPem.kode AS kode_beli
	FROM Pembelian AS Pem
		INNER JOIN
		Kode_Pembelian AS Kpem
		ON Pem.kode_id = KPem.id) AS Pembelian
ON Penjualan.pembelian_id = Pembelian.id
INNER JOIN Kode_Penjualan
ON Penjualan.kode_id = Kode_Penjualan.id
WHERE Pembelian.kode_id_pembelian = $1 AND Penjualan.wilayah_id = $2
`,
    [v, w])

}
