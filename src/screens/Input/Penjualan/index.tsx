import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography";
import Database from "@tauri-apps/plugin-sql";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormPenjualan from "./components/FormPenjualan";
import Alert from "@mui/material/Alert"
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar"
import { getCustomPemb } from "../../../helpers/fetchSQL/Select/pembelian";
import { getKodePembeAsLab, getKodePenjuAsLab } from "../../../helpers/fetchSQL/Select";
import SearchPembelianPen from "./components/SearchPembelianPen";


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

export default function InputPenjualan() {

  const { id } = useParams()

  const [valueKodePen, setValueKodePen] = useState<{ id: number, label: string }[]>([])
  const [valueKodePemb, setValueKodePemb] = useState<{ id: number, label: string }[]>([])
  const [wilayah, setWilayah] = useState<{ id: number, nama: string }[]>([])
  const [dataPembelian, setDataPembelian] = useState<pembelianProps[]>([])
  const [choosed, setChoosed] = useState<pembelianProps | undefined>(undefined)
  const [openSnack, setOpenSnack] = useState(false)

  async function getData() {
    const db = await Database.load('sqlite:main.db')
    const dataWilayah = await db.select<{ id: number, nama: string }[]>('SELECT id,nama FROM Wilayah WHERE id = $1', [id])
    setValueKodePen(await getKodePenjuAsLab())
    setValueKodePemb(await getKodePembeAsLab())
    setWilayah(dataWilayah)
  }

  useEffect(() => {
    getData()
  }, [id])

  async function handleGetData(kode_id: number | undefined, no: string) {
    setDataPembelian(await getCustomPemb(kode_id, Number(id), no))
  }

  function handleChoosePembelian(params: pembelianProps) {
    setDataPembelian(dataPembelian.filter(d => d.id !== params.id))
    setChoosed(params)
  }

  function handleCloseSnack(_event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason) {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false)
  }

  function handleFinish() {
    setChoosed(undefined)
    setOpenSnack(true)
  }

  function handleBack() {
    if (choosed != undefined) {
      setDataPembelian([...dataPembelian, choosed])
    }
    setChoosed(undefined)
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
          Berhasil Input Data Pembelian
        </Alert>
      </Snackbar>
      <Typography variant="h4">Input Penjualan {wilayah.length != 0 ? wilayah[0].nama : ''}</Typography>
      <Stack marginTop='20px'>

        {wilayah.length != 0 &&
          <Stack direction='row' width='100%'>
            {choosed == undefined && <SearchPembelianPen
              getKodePem={valueKodePemb}
              dataPembelian={dataPembelian}
              handleGetData={handleGetData}
              handleSubmitPembelian={handleChoosePembelian}
            />
            }
            {choosed != undefined &&
              <FormPenjualan
                handleBack={handleBack}
                choosed={choosed}
                removeChoosed={handleFinish}
                valueKode={valueKodePen} />
            }
          </Stack>
        }
      </Stack>
    </Box >
  )
}
