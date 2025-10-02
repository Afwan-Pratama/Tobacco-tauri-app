import Save from "@mui/icons-material/Save";
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import FormControl from "@mui/material/FormControl"
import FormHelperText from "@mui/material/FormHelperText"
import InputAdornment from "@mui/material/InputAdornment"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography";
import Database from "@tauri-apps/plugin-sql";
import Autocomplete from "@mui/material/Autocomplete";
import { useEffect, useMemo, useState } from "react";
import { load } from "@tauri-apps/plugin-store"
import Stack from '@mui/material/Stack';
import Alert from "@mui/material/Alert";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import PrintPage from "../../../components/PrintPage";
import PreviewPrint from "../../../components/PreviewPrint";
import { useParams } from "react-router-dom";
import { dateNow } from "../../../helpers/dateNow";

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

  const { id } = useParams()

  const [inputValue, setInputValue] = useState({
    no: '',
    kode_id: '',
    nama: '',
    harga: 0,
    bruto: 0,
    netto: 0,
    bonus: 0,
    created_date: ''
  })
  const [valueWilayah, setValueWilayah] = useState<wilayahProps[]>([])
  const [valueKode, setValueKode] = useState<{ id: number, label: string }[]>([])
  const [jumlahPembelian, setJumlahPembelian] = useState<pembelianProps[]>([])
  const [fieldDisable, setFieldDisable] = useState(false)
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
  const jumlahHarga = useMemo<number>(() => (
    inputValue.netto > 0 ?
      inputValue.netto * inputValue.harga :
      0
  ), [inputValue.harga, inputValue.netto])

  async function getData() {
    const db = await Database.load('sqlite:main.db')
    const dataWilayah = await db.select<wilayahProps[]>('SELECT * FROM Wilayah WHERE id = $1', [id])
    setValueWilayah(dataWilayah)
    setValueKode(await db.select('SELECT id,kode AS label FROM Kode_Pembelian'))
  }

  async function getStore() {
    const store = await load('settings.json')
    setDataBiaya(await store.get<biayaPembelian>('biaya_pembelian'))
  }

  useEffect(() => {
    getData()
    getStore()
  }, [id])

  useEffect(() => {
    if (valueWilayah.length != 0 && inputValue.bruto != 0) {
      const wilayah = valueWilayah[0]
      switch (wilayah.kondisi) {
        case "kurang":
          if (inputValue.bruto < wilayah.value_kondisi) {
            setInputValue({
              ...inputValue,
              netto: inputValue.bruto - wilayah.netto_kondisi
            })
          } else {
            setInputValue({
              ...inputValue,
              netto: inputValue.bruto - wilayah.netto_default
            })
          }
          break;
        case "lebih":
          if (inputValue.bruto > wilayah.value_kondisi) {
            setInputValue({
              ...inputValue,
              netto: inputValue.bruto - wilayah.netto_kondisi
            })
          } else {
            setInputValue({
              ...inputValue,
              netto: inputValue.bruto - wilayah.netto_default
            })
          }
          break;
        case "tidak":
          setInputValue({
            ...inputValue,
            netto: inputValue.bruto - wilayah.netto_default
          })
          break;
      }
    }
  }, [inputValue.bruto])

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

  function clearField() {
    setInputValue({
      ...inputValue,
      no: '',
      harga: 0,
      bruto: 0,
      netto: 0,
    })
  }

  const handleNext = () => {
    setJumlahPembelian([...jumlahPembelian,
    {
      ...inputValue,
      wilayah_id: valueWilayah[0].id,
      created_date: dateNow(),
      jumlah_harga: jumlahHarga
    }
    ])
    setFieldDisable(true)
    clearField()
    setRefreshTotal(!refreshTotal)
  }

  async function sendToDB() {
    const db = await Database.load('sqlite:main.db')
    const getKodeId = await db.select<{ id: number }[]>('SELECT id FROM Kode_Pembelian WHERE kode = $1', [jumlahPembelian[0].kode_id])
    for (let i = 0; i < jumlahPembelian.length; i++) {
      const pembelian = jumlahPembelian[i]
      await db.execute('INSERT INTO Pembelian (wilayah_id,kode_id,nama,harga,bruto,netto,jumlah_harga,no,bonus,created_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
        [
          pembelian.wilayah_id,
          getKodeId[0].id,
          pembelian.nama,
          pembelian.harga,
          pembelian.bruto,
          pembelian.netto,
          pembelian.jumlah_harga,
          pembelian.no,
          pembelian.bonus,
          pembelian.created_date
        ])
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
    setFieldDisable(false)
  }

  async function handleOnlySave() {
    await sendToDB()
    afterSend()
    clearField()
    setOpenSnack(true)
  }

  function handleCloseSnack(_event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason) {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false)
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
          Berhasil Menyimpan Data
        </Alert>
      </Snackbar>
      {valueWilayah.length != 0 && <Typography variant="h4">Input Pembelian {valueWilayah[0].nama}</Typography>}
      <Box sx={{ marginBottom: '20px' }}>
        <Stack
          direction='row'
          component={"section"}
          gap={'50px'}
          justifyContent='space-between'
          sx={{ p: 2, border: '2px solid black', borderRadius: 1, marginY: '20px' }}>
          <Box>
            <TextField
              autoFocus
              margin="normal"
              label="No."
              fullWidth
              onChange={(e) => setInputValue({
                ...inputValue,
                no: e.target.value.toUpperCase()
              })}
              value={inputValue.no}
            />

            <FormControl fullWidth margin="normal">
              <Autocomplete
                disablePortal
                options={valueKode}
                autoHighlight
                disabled={fieldDisable}
                inputValue={inputValue.kode_id}
                onChange={(_e, d) => setInputValue({
                  ...inputValue,
                  kode_id: d === null || d === undefined ? '' : d.label
                })}
                renderInput={(params) => <TextField {...params} label="Kode" />}
              />
              {
                valueKode.length == 0 && (
                  <FormHelperText error={true} >Data Kode Pembelian Masih Kosong</FormHelperText>
                )
              }
            </FormControl>

            <TextField
              disabled={fieldDisable}
              margin="normal"
              label={"Nama"}
              fullWidth
              onChange={(e) => setInputValue({
                ...inputValue,
                nama: e.target.value.toUpperCase()
              })}
              value={inputValue.nama} />
            <TextField
              margin="normal"
              label={"Harga"}
              fullWidth
              type="number"
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start">Rp</InputAdornment>
                }
              }}
              onChange={(e) => setInputValue({
                ...inputValue,
                //@ts-ignore
                harga: e.target.value
              })}
              value={inputValue.harga == 0 ? '' : inputValue.harga}
            />
            <TextField
              margin="normal"
              label={"Bruto"}
              fullWidth
              type="number"
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position="end">Kg</InputAdornment>
                }
              }}
              onChange={(e) => setInputValue({
                ...inputValue,
                //@ts-ignore
                bruto: e.target.value
              })}
              value={inputValue.bruto == 0 ? '' : inputValue.bruto} />
            <TextField
              margin="normal"
              label={"Bonus"}
              fullWidth
              type="number"
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start">Rp.</InputAdornment>
                }
              }}
              onChange={(e) => setInputValue({
                ...inputValue,
                //@ts-ignore
                bonus: e.target.value
              })}
              value={inputValue.bonus == 0 ? '' : inputValue.bonus} />
            <Typography variant="body1">Netto : {inputValue.netto} Kg</Typography>
            <Typography variant="body1">Jumlah Harga: Rp.{jumlahHarga}</Typography>
            <Button
              variant="contained"
              sx={{ margin: '20px' }}
              disabled={
                inputValue.harga == 0 ||
                inputValue.bruto == 0 ||
                inputValue.no == '' ||
                inputValue.kode_id == '' ||
                inputValue.nama == '' ||
                inputValue.bonus == 0
              }
              endIcon={<Save />}
              onClick={handleNext}>
              Lanjutkan
            </Button>
          </Box>
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
        </Stack>
      </Box>
    </Box >
  )
}
