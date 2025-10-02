import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography";
import Database from "@tauri-apps/plugin-sql";
import { useEffect, useState } from "react";
import { load } from "@tauri-apps/plugin-store"
import Stack from '@mui/material/Stack';
import Alert from "@mui/material/Alert";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import PrintPage from "../../components/PrintPage";
import PreviewPrint from "../../components/PreviewPrint";
import { getKodePembeAsLab, getWilayah, getWilayahOnlyLab } from "../../helpers/fetchSQL/Select";
import FormPem from "./components/FormPem";
import SearchPembelian from "./components/SearchPembelian";
import { getCustomPemb } from "../../helpers/fetchSQL/Select/pembelian";
import { updatePembelian } from "../../helpers/fetchSQL/Update";

interface biayaPembelian {
  administrasi: number
  pajak: number
  rokok: number
  mod_rokok: number
}

interface pembelianAkhir {
  administrasi: number
  pajak: number
  rokok: number
  jumlah_rokok: number
}

interface wilayahProps {
  id: number
  nama: string
  kondisi: string
  value_kondisi: number
  netto_kondisi: number
  netto_default: number
}

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

export default function InputPembelian() {

  const [dataPembelian, setDataPembelian] = useState<pembelianProps[]>([])
  const [choosed, setChoosed] = useState<pembelianProps>()
  const [valueWilayah, setValueWilayah] = useState<wilayahProps[]>([])
  const [valueKode, setValueKode] = useState<{ id: number, label: string }[]>([])
  const [wilayahLabel, setWilayahLabel] = useState<{ id: number, label: string }[]>([])
  const [jumlahPembelian, setJumlahPembelian] = useState<pembelianProps[]>([])
  const [jumlahTotal, setJumlahTotal] = useState({
    bruto: 0,
    netto: 0,
    harga: 0
  })
  const [refreshTotal, setRefreshTotal] = useState(true)
  const [dataBiaya, setDataBiaya] = useState<biayaPembelian | undefined>({
    administrasi: 0,
    pajak: 0,
    rokok: 0,
    mod_rokok: 0
  })
  const [biayaAkhir, setBiayaAkhir] = useState<pembelianAkhir>({
    administrasi: 0,
    pajak: 0,
    rokok: 0,
    jumlah_rokok: 0
  })
  const [totalAkhir, setTotalAkhir] = useState(0)
  const [openSnack, setOpenSnack] = useState(false)

  async function getData() {
    setValueWilayah(await getWilayah())
    setValueKode(await getKodePembeAsLab())
    setWilayahLabel(await getWilayahOnlyLab())
  }

  async function getStore() {
    const store = await load('settings.json')
    setDataBiaya(await store.get<biayaPembelian>('biaya_pembelian'))
  }

  useEffect(() => {
    getData()
    getStore()
  }, [])

  useEffect(() => {
    if (dataBiaya != undefined && jumlahPembelian.length > 0) {
      const administrasi = jumlahPembelian.length * dataBiaya?.administrasi
      const hargaTotal = jumlahPembelian.reduce((v, n) => v + n.jumlah_harga, 0)
      const jumlahRokok = Math.floor(hargaTotal / dataBiaya?.mod_rokok)
      const pajak = (hargaTotal * dataBiaya?.pajak) / 100
      const rokok = jumlahRokok * dataBiaya?.rokok
      setBiayaAkhir({
        administrasi: administrasi,
        jumlah_rokok: jumlahRokok,
        pajak: pajak,
        rokok: rokok
      })
      setJumlahTotal({
        bruto: jumlahPembelian.reduce((v, n) => v + n.bruto, 0),
        netto: jumlahPembelian.reduce((v, n) => v + n.netto, 0),
        harga: hargaTotal
      })
      setTotalAkhir(hargaTotal - administrasi - pajak - rokok)
    }
  }, [refreshTotal])


  const handleNext = (e: pembelianProps) => {
    setJumlahPembelian([...jumlahPembelian,
      e
    ])
    setChoosed(undefined)
    setRefreshTotal(!refreshTotal)
  }

  async function sendToDB() {
    const db = await Database.load('sqlite:main.db')
    const getKodeId = await db.select<{ id: number }[]>('SELECT id FROM Kode_Pembelian WHERE kode = $1', [jumlahPembelian[0].kode_id])
    for (let i = 0; i < jumlahPembelian.length; i++) {
      const pembelian = jumlahPembelian[i]
      await updatePembelian(
        pembelian.id,
        getKodeId[0].id,
        pembelian.no,
        pembelian.nama,
        pembelian.harga,
        pembelian.bruto,
        pembelian.netto,
        pembelian.jumlah_harga,
        pembelian.bonus,
        pembelian.created_date
      )
    }
  }

  function afterSend() {
    setTotalAkhir(0)
    setJumlahTotal({
      bruto: 0,
      netto: 0,
      harga: 0
    })
    setBiayaAkhir({
      administrasi: 0,
      jumlah_rokok: 0,
      pajak: 0,
      rokok: 0
    })
    setJumlahPembelian([])
  }

  async function handleOnlySave() {
    await sendToDB()
    afterSend()
    setOpenSnack(true)
  }

  function handleCloseSnack(_event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason) {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false)
  }

  async function handleGetData(kode_id: number | undefined, wilayah_id: number | undefined, no: string) {
    setDataPembelian(await getCustomPemb(kode_id, wilayah_id, no))
  }

  function handleChoosePembelian(params: pembelianProps) {
    setChoosed(params)
  }

  return (
    <Box>
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openSnack} autoHideDuration={5000} onClose={handleCloseSnack}>
        <Alert
          onClose={handleCloseSnack}
          severity='success'
          variant='filled'
          sx={{ width: '100%' }}
        >
          Berhasil Mengubah Data
        </Alert>
      </Snackbar>
      <Typography variant="h4">Nota Khusus</Typography>
      <Box sx={{ marginBottom: '20px' }}>
        <Stack
          direction='row'
          component={"section"}
          gap={'50px'}
          justifyContent='space-between'
          sx={{ p: 2, border: '2px solid black', borderRadius: 1, marginY: '20px' }}>
          {choosed == undefined && (
            <SearchPembelian
              getWil={wilayahLabel}
              handleSubmitPembelian={handleChoosePembelian}
              dataPembelian={dataPembelian}
              handleGetData={handleGetData}
              getKodePem={valueKode}
              jumlah={jumlahPembelian}
            />
          )}
          {choosed != undefined && (
            <FormPem
              valueKode={valueKode}
              handleAdd={handleNext}
              choosed={choosed}
              wilayahChoosed={valueWilayah.find((w) => w.id == choosed.wilayah_id)}
            />
          )}
          {jumlahPembelian.length != 0 && (
            <Stack width='500px' justifyContent='space-between'>
              <PreviewPrint
                dataPembelian={jumlahPembelian}
                dataBiaya={dataBiaya}
                biayaAkhir={biayaAkhir}
                jumlahTotal={jumlahTotal}
                totalAkhir={totalAkhir}
              />
              <PrintPage
                dataPembelian={jumlahPembelian}
                dataBiaya={dataBiaya}
                biayaAkhir={biayaAkhir}
                jumlahTotal={jumlahTotal}
                totalAkhir={totalAkhir}
                handleOnlySave={handleOnlySave}
              />
            </Stack>
          )}
        </Stack>
      </Box>
    </Box >
  )
}
