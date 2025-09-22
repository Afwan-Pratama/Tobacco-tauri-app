import Save from "@mui/icons-material/Save";
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import FormControl from "@mui/material/FormControl"
import FormHelperText from "@mui/material/FormHelperText"
import InputAdornment from "@mui/material/InputAdornment"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography";
import Database from "@tauri-apps/plugin-sql";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { load } from "@tauri-apps/plugin-store"
import Stack from '@mui/material/Stack';
import Alert from "@mui/material/Alert";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import PrintPage from "../../../components/PrintPage";
import PreviewPrint from "./components/PreviewPrint";

interface IFormInput {
  kode_id: number
  nama: string
}

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
  wilayah_id: number
  kode_id: number
  nama: string
  harga: number
  bruto: number
  netto: number
  jumlah_harga: number
}

export default function InputPembelian() {

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      kode_id: 0,
      nama: '',
    }
  })

  const [bruto, setBruto] = useState(0)
  const [netto, setNetto] = useState(0)
  const [inputWilayah, setInputWilayah] = useState(null)
  const [valueWilayah, setValueWilayah] = useState<wilayahProps[]>([])
  const [valueKode, setValueKode] = useState<{ id: number, kode: string }[]>([])
  const [harga, setHarga] = useState(0)
  const [jumlahHarga, setJumlahHarga] = useState(0)
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
  const [inputId, setInputId] = useState(0)
  const [openSnack, setOpenSnack] = useState(false)

  async function getData() {
    const db = await Database.load('sqlite:test.db')
    const id: { id: number }[] = await db.select('SELECT id FROM Pembelian ORDER BY id DESC LIMIT 1')
    setValueWilayah(await db.select('SELECT * FROM Wilayah'))
    setValueKode(await db.select('SELECT id,kode FROM Kode'))
    if (id.length == 0) {
      return
    }
    else {
      setInputId(id[0].id + 1)
    }
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
    if (inputWilayah != null) {
      const wilayah = valueWilayah[inputWilayah]
      switch (wilayah.kondisi) {
        case "kurang":
          if (bruto < wilayah.value_kondisi) {
            setNetto(bruto - wilayah.netto_kondisi)
          } else {
            setNetto(bruto - wilayah.netto_default)
          }
          break;
        case "lebih":
          if (bruto > wilayah.value_kondisi) {
            setNetto(bruto - wilayah.netto_kondisi)
          } else {
            setNetto(bruto - wilayah.netto_default)
          }
          break;
        case "tidak":
          setNetto(bruto - wilayah.netto_default)
          break;
      }
    }
  }, [bruto])

  useEffect(() => {
    if (netto > 0) {
      setJumlahHarga(harga * netto)
    }
  }, [{ harga, bruto }])

  useEffect(() => {
    if (dataBiaya != undefined) {
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
    setHarga(0)
    setBruto(0)
    setNetto(0)
    setJumlahHarga(0)
  }

  const handleNext: SubmitHandler<IFormInput> = (data) => {
    if (inputWilayah != null) {
      setJumlahPembelian([...jumlahPembelian,
      {
        id: inputId,
        wilayah_id: valueWilayah[inputWilayah].id,
        kode_id: data.kode_id,
        nama: data.nama,
        harga: harga,
        bruto: bruto,
        netto: netto,
        jumlah_harga: jumlahHarga
      }
      ])
      setFieldDisable(true)
      clearField()
      setRefreshTotal(!refreshTotal)
      setInputId(v => v += 1)
    }
  }

  async function sendToDB() {
    const db = await Database.load('sqlite:test.db')
    for (let i = 0; i < jumlahPembelian.length; i++) {
      const pembelian = jumlahPembelian[i]
      await db.execute('INSERT INTO Pembelian (wilayah_id,kode_id,nama,harga,bruto,netto,jumlah_harga) VALUES ($1,$2,$3,$4,$5,$6,$7)',
        [pembelian.wilayah_id, pembelian.kode_id, pembelian.nama, pembelian.harga, pembelian.bruto, pembelian.netto, pembelian.jumlah_harga])
    }
  }

  function afterSend() {
    setInputWilayah(null)
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
      <Typography variant="h4">Input Pembelian</Typography>
      <Box sx={{ marginBottom: '20px' }}>
        <Stack
          direction='row'
          component={"section"}
          justifyContent='space-between'
          sx={{ p: 2, border: '2px solid black', borderRadius: 1, marginY: '20px' }}>
          <Box>

            <FormControl fullWidth margin="normal">
              <InputLabel >Wilayah</InputLabel>
              <Select
                disabled={fieldDisable}
                label="Wilayah"
                //@ts-ignore
                onChange={(e) => setInputWilayah(e.target.value)}
                value={inputWilayah}
              >
                {valueWilayah.map((v, i) => (
                  <MenuItem value={i}>{v.nama}</MenuItem>
                ))
                }
              </Select>
              {
                valueWilayah.length == 0 && (
                  <FormHelperText error={true} >Data Wilayah Masih Kosong</FormHelperText>
                )
              }
            </FormControl>

            <Controller
              name="kode_id"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <FormControl fullWidth margin="normal">
                  <InputLabel >Kode</InputLabel>
                  <Select
                    error={errors.kode_id ? true : false}
                    disabled={fieldDisable}
                    label="Kode"
                    onChange={onChange}
                    value={value}
                  >
                    {valueKode.map((v) => (
                      <MenuItem value={v.id}>{v.kode}</MenuItem>
                    ))
                    }
                  </Select>
                  {
                    errors.kode_id && (
                      <FormHelperText error={errors.kode_id ? true : false}>Inputan masih kosong</FormHelperText>
                    )
                  }
                  {
                    valueKode.length == 0 && (
                      <FormHelperText error={true} >Data Kode Masih Kosong</FormHelperText>
                    )
                  }
                </FormControl>

              )} />
            <Controller
              name="nama"
              rules={{ required: true }}
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextField
                  disabled={fieldDisable}
                  margin="normal"
                  label={"Nama"}
                  error={errors.nama ? true : false}
                  helperText={errors.nama ? 'Inputan Salah' : ''}
                  fullWidth
                  onChange={onChange}
                  value={value} />
              )} />
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
              //@ts-ignore
              onChange={(e) => setHarga(e.target.value)}
              value={harga}
              disabled={inputWilayah == null} />
            <TextField
              margin="normal"
              label={"Bruto"}
              disabled={inputWilayah == null}
              fullWidth
              type="number"
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position="end">Kg</InputAdornment>
                }
              }}
              //@ts-ignore
              onChange={(e) => setBruto(e.target.value)}
              value={bruto} />
            <Typography variant="body1">Netto : {netto} Kg</Typography>
            <Typography variant="body1">Jumlah Harga: Rp.{jumlahHarga}</Typography>
            <Button
              variant="contained"
              sx={{ margin: '20px' }}
              disabled={harga == 0 || bruto == 0}
              endIcon={<Save />}
              onClick={handleSubmit(handleNext)}>
              Lanjutkan
            </Button>
          </Box>
          <Stack width='400px' justifyContent='space-between'>
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
