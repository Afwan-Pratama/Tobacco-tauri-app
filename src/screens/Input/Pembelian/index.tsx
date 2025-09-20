import Print from "@mui/icons-material/Print"
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
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from "@mui/material/TableRow";

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
  const [valueWilayah, setValueWilayah] = useState([])
  const [valueKode, setValueKode] = useState([])
  const [harga, setHarga] = useState(0)
  const [jumlahHarga, setJumlahHarga] = useState(0)
  const [jumlahPembelian, setJumlahPembelian] = useState([])
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

  async function getData() {
    const db = await Database.load('sqlite:test.db')
    setValueWilayah(await db.select('SELECT * FROM Wilayah'))
    setValueKode(await db.select('SELECT id,kode FROM Kode'))
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
            setNetto((v) => v = bruto - wilayah.netto_kondisi)
          } else {
            setNetto((v) => v = bruto - wilayah.netto_default)
          }
          break;
        case "lebih":
          if (bruto > wilayah.value_kondisi) {
            setNetto((v) => v = bruto - wilayah.netto_kondisi)
          } else {
            setNetto((v) => v = bruto - wilayah.netto_default)
          }
          break;
        case "tidak":
          setNetto((v) => v = bruto - wilayah.netto_default)
          break;
      }
    }
  }, [bruto])

  useEffect(() => {
    if (netto > 0) {
      setJumlahHarga((v) => v = harga * netto)
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

  const handleNext: SubmitHandler<IFormInput> = (data) => {
    if (inputWilayah != null) {
      setJumlahPembelian([...jumlahPembelian,
      {
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
      setHarga(0)
      setBruto(0)
      setNetto(0)
      setJumlahHarga(0)
      setRefreshTotal(!refreshTotal)
    }
  }

  async function handlePrint() {
    const db = await Database.load('sqlite:test.db')
    for (let i = 0; i < jumlahPembelian.length; i++) {
      const pembelian = jumlahPembelian[i]
      await db.execute('INSERT INTO Pembelian (wilayah_id,kode_id,nama,harga,bruto,netto,jumlah_harga) VALUES ($1,$2,$3,$4,$5,$6,$7)',
        [pembelian.wilayah_id, pembelian.kode_id, pembelian.nama, pembelian.harga, pembelian.bruto, pembelian.netto, pembelian.jumlah_harga])
    }
    console.log('sss')
    setHarga(0)
    setBruto(0)
    setNetto(0)
    setJumlahHarga(0)
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

  return (
    <Box paddingY={0}>
      <Typography variant="h4">Input Pembelian</Typography>
      <Box sx={{ marginBottom: '20px' }}>
        <Box component={"section"} sx={{ p: 2, border: '2px solid black', borderRadius: 1, marginY: '20px' }}>
          <FormControl fullWidth margin="normal">
            <InputLabel >Wilayah</InputLabel>
            <Select
              disabled={fieldDisable}
              label="Wilayah"
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
              <TextField disabled={fieldDisable} margin="normal" label={"Nama"} error={errors.nama ? true : false} helperText={errors.nama ? 'Inputan Salah' : ''} fullWidth onChange={onChange} value={value} />
            )} />
          <TextField margin="normal" label={"Harga"} fullWidth type="number" slotProps={{
            input: {
              startAdornment: <InputAdornment position="start">Rp</InputAdornment>
            }
          }} onChange={(e) => setHarga(e.target.value)} value={harga} disabled={inputWilayah == null} />
          <TextField margin="normal" label={"Bruto"} disabled={inputWilayah == null} fullWidth type="number" slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">Kg</InputAdornment>
            }
          }} onChange={(e) => setBruto(e.target.value)} value={bruto} />
          <Typography variant="body1">Netto : {netto} Kg</Typography>
          <Typography variant="body1">Jumlah Harga: Rp.{jumlahHarga}</Typography>
          <Button variant="contained" sx={{ margin: '20px' }} disabled={harga == 0 || bruto == 0} endIcon={<Save />} onClick={handleSubmit(handleNext)}>Lanjutkan</Button>
        </Box>
      </Box>
      {jumlahPembelian.length != 0 && (
        <Stack gap='20px' sx={{ p: 4, boxShadow: 24, minHeight: '200px', zIndex: 4, position: "sticky", bottom: 0, right: 0, left: 0, bgcolor: 'background.paper' }} direction='row' justifyContent='space-between'>
          <TableContainer component={Paper} sx={{ width: '400px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nama</TableCell>
                  <TableCell>Harga</TableCell>
                  <TableCell>Bruto</TableCell>
                  <TableCell>Netto</TableCell>
                  <TableCell>Jumlah Harga</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jumlahPembelian.map((v, i) => (
                  <TableRow
                    key={i}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>{v.nama}</TableCell>
                    <TableCell>{v.harga}</TableCell>
                    <TableCell>{v.bruto}</TableCell>
                    <TableCell>{v.netto}</TableCell>
                    <TableCell>{v.jumlah_harga}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack flexWrap='nowrap' direction='row' justifyContent='end' gap='20px'>
            <Box>
              <Typography variant="body1" sx={{ opacity: '0' }}>{'-'}</Typography>
              <Typography variant="body2" sx={{ opacity: '0' }}>{'-'}</Typography>
              <Typography variant="body2">Administrasi</Typography>
              <Typography variant="body2">Pajak</Typography>
              <Typography variant="body2">Rokok</Typography>
              <Divider sx={{ opacity: '0' }} />
              <Typography variant="body2" sx={{ opacity: '0' }}>{'-'}</Typography>
            </Box>
            <Box>
              <Typography variant="body1">{'Harga Satuan'}</Typography>
              <Typography variant="body2" sx={{ opacity: '0' }}>{'-'}</Typography>
              <Typography variant="body2">Rp. {dataBiaya?.administrasi}</Typography>
              <Typography variant="body2">{dataBiaya?.pajak}%</Typography>
              <Typography variant="body2">Rp. {dataBiaya?.rokok}</Typography>
              <Divider sx={{ opacity: '0' }} />
              <Typography variant="body2" sx={{ opacity: '0' }}>{'-'}</Typography>
            </Box>
            <Box>
              <Typography variant="body1" sx={{ opacity: '0' }}>{'-'}</Typography>
              <Typography variant="body2" sx={{ opacity: '0' }}>{'-'}</Typography>
              <Typography variant="body2">{'x'}</Typography>
              <Typography variant="body2" sx={{ opacity: '0' }}>{'-'}</Typography>
              <Typography variant="body2">{'x'}</Typography>
              <Divider sx={{ opacity: '0' }} />
              <Typography variant="body2" sx={{ opacity: '0' }}>{'-'}</Typography>
            </Box>
            <Box>
              <Typography variant="body1">{'Jumlah'}</Typography>
              <Typography variant="body2" sx={{ opacity: '0' }}>{'-'}</Typography>
              <Typography variant="body2">{jumlahPembelian.length} Keranjang</Typography>
              <Typography variant="body2" sx={{ opacity: '0' }}>{'-'}</Typography>
              <Typography variant="body2">{biayaAkhir.jumlah_rokok} Rokok</Typography>
              <Divider />
              <Typography variant="body2">{'Total Akhir :'}</Typography>
            </Box>
            <Box>
              <Typography variant="body1">{'Total Jumlah Harga'}</Typography>
              <Typography variant="body2">Rp. {jumlahTotal.harga}</Typography>
              <Typography variant="body2">Rp. {biayaAkhir.administrasi}</Typography>
              <Typography variant="body2">Rp. {biayaAkhir.pajak}</Typography>
              <Typography variant="body2">Rp. {biayaAkhir.rokok}</Typography>
              <Divider />
              <Typography variant="body2">Rp. {totalAkhir}</Typography>
            </Box>
            <Stack justifyContent='center' alignContent='center'>
              <Button variant="contained" sx={{ margin: '20px' }} onClick={handlePrint} startIcon={<Print />}>Cetak</Button>
            </Stack>
          </Stack>
        </Stack>
      )}
    </Box >
  )
}
