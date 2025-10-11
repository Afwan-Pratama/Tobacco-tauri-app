import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import Database from '@tauri-apps/plugin-sql';
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField';
import { useParams } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel';
import numberSplitter from '../../../helpers/numberSplitter';

const columns: GridColDef[] = [
  { field: 'no', headerName: 'No.', width: 90 },
  {
    field: 'created_date',
    headerName: 'Tanggal',
    width: 100
  },
  {
    field: 'kode',
    headerName: 'Kode',
    width: 100,
  },
  {
    field: 'nama',
    headerName: 'Nama',
    width: 150,
  },
  {
    field: 'harga',
    headerName: 'Harga (Rp)',
    type: 'number',
    width: 160,
  },
  {
    field: 'bruto',
    headerName: 'Bruto (Kg)',
    type: 'number',
    width: 100,
  },
  {
    field: 'netto',
    headerName: 'Netto (Kg)',
    type: 'number',
    width: 100,
  },
  {
    field: 'sold',
    headerName: 'Terjual',
    width: 100,
    type: 'number'
  },
  {
    field: 'jumlah_harga',
    headerName: 'Jumlah Harga (Rp)',
    type: 'number',
    width: 200
  }
];

interface pembelianProps {
  id: number
  no: string
  created_date: string
  nama: string
  kode: string
  harga: number
  bruto: number
  netto: number
  jumlah_harga: number
}

export default function DataPembelian() {

  const { id } = useParams()

  const [dataPembelian, setDataPembelian] = useState<pembelianProps[]>([])
  const [jumlahTotal, setJumlahTotal] = useState({
    harga: 0,
    bruto: 0,
    netto: 0,
    jumlah_harga: 0
  })
  const [valueKode, setValueKode] = useState<{ id: number, label: string }[]>([])
  const [filterNomer, setFilterNomer] = useState('')
  const [filterNama, setFilterNama] = useState('')
  const [filterKode, setFilterKode] = useState<string>('')
  const [wilayah, setWilayah] = useState<{ id: number, nama: string }[]>([])
  const [checked, setChecked] = useState({
    jual: 0,
    lunas: 0,
  })

  function sendToFront(params: pembelianProps[]) {
    setDataPembelian(params)
    setJumlahTotal({
      harga: params.reduce((v: number, n) => v + n.harga, 0),
      bruto: params.reduce((v: number, n) => v + n.bruto, 0),
      netto: params.reduce((v: number, n) => v + n.netto, 0),
      jumlah_harga: params.reduce((v: number, n) => v + n.jumlah_harga, 0)
    })
  }

  async function getKode() {
    const db = await Database.load('sqlite:main.db')
    const kode: { id: number, label: string }[] = await db.select('SELECT id,kode AS label from Kode_Pembelian')
    setValueKode(kode)
  }

  async function getData() {
    const db = await Database.load('sqlite:main.db')
    const dataWilayah = await db.select<{ id: number, nama: string }[]>('SELECT * FROM Wilayah WHERE id = $1', [id])
    const data: pembelianProps[] = await db.select('SELECT Pembelian.*, kode from Pembelian INNER JOIN Kode_Pembelian ON Pembelian.kode_id = Kode_Pembelian.id WHERE wilayah_id = $1',
      [id])
    setWilayah(dataWilayah)
    sendToFront(data)
  }

  useEffect(() => {
    getData()
    getKode()
  }, [id])

  async function handleFilterNomer(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      const db = await Database.load('sqlite:main.db')
      const data: pembelianProps[] = await db.select('SELECT Pembelian.*, kode from Pembelian INNER JOIN Kode_Pembelian ON Pembelian.kode_id = Kode_Pembelian.id WHERE Pembelian.id = $1 AND wilayah_id = $2',
        [filterNomer, id])
      sendToFront(data)
    }
  }

  async function handleFilterKode(v: { id: number, label: string }) {
    setFilterKode(v?.label)
    if (v.label != '') {
      setFilterNomer('')
      setFilterNama('')
      const db = await Database.load('sqlite:main.db')
      const kodeId = valueKode.find(k => k.label == v.label)
      const data: pembelianProps[] = await db.select('SELECT Pembelian.*, kode from Pembelian INNER JOIN Kode_Pembelian ON Pembelian.kode_id = Kode_Pembelian.id WHERE kode_id = $1 AND wilayah_id = $2',
        [kodeId?.id, id])
      sendToFront(data)
    }

  }

  async function handleFilterNama(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      const db = await Database.load('sqlite:main.db')
      const data: pembelianProps[] = await db.select('SELECT Pembelian.*, kode from Pembelian INNER JOIN Kode_Pembelian ON Pembelian.kode_id = Kode_Pembelian.id WHERE nama = $1 AND wilayah_id = $2',
        [filterNama, id])
      sendToFront(data)
    }
  }

  function handleDeleteFilter() {
    getData()
    setFilterNama('')
    setFilterKode('')
    setFilterNomer('')
  }

  return (
    <Box>
      <Typography variant='h4'>Data Pembelian {wilayah.length != 0 ? wilayah[0].nama : ''}</Typography>
      <Stack direction='row' marginTop='20px' gap='20px'>
        <TextField
          type='number' label='No.'
          onChange={(e) => {
            setFilterNomer(e.target.value)
            setFilterNama('')
            setFilterKode('')
          }}
          value={filterKode}
          onKeyDown={handleFilterNomer}
        />
        <Autocomplete
          sx={{
            width: '300px'
          }}
          disablePortal
          options={valueKode}
          autoHighlight
          onChange={(_e, d) => handleFilterKode(d === null || d === undefined ? { id: 0, label: '' } : d)}
          inputValue={filterKode}
          renderInput={(params) => <TextField {...params} label="Kode" />}
        />
        <TextField
          label='Nama'
          onChange={(e) => {
            setFilterNama(e.target.value)
            setFilterKode('')
            setFilterNomer('')
          }}
          onKeyDown={handleFilterNama}
          value={filterNama} />
        {(filterKode != '' || filterNomer != '' || filterNama != '') &&
          <Button onClick={handleDeleteFilter}>Hapus Filter</Button>
        }
        <FormControlLabel
          control={
            <Checkbox
              value={checked.jual === 1 ? true : false}
              onChange={(e) => setChecked({
                ...checked,
                jual: e.target.checked ? 1 : 0
              })}
            />}
          label="Terjual" />
        <FormControlLabel
          control={
            <Checkbox
              value={checked.lunas === 1 ? true : false}
              onChange={(e) => setChecked({
                ...checked,
                lunas: e.target.checked ? 1 : 0
              })}
            />}
          label="Lunas" />
      </Stack>
      <div style={{ margin: "20px 0", display: 'flex', flexDirection: 'column' }}>
        <DataGrid
          rows={dataPembelian}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
          rowHeight={35}
          disableRowSelectionOnClick
        />
      </div>
      {dataPembelian.length != 0 &&
        <Stack justifyContent='space-between' direction='row' sx={{ p: 4, bgcolor: 'background.paper', bottom: 0, right: 0, left: 0, position: 'sticky' }}>
          <Box>
            <Typography variant='body1'>Total Keranjang: {dataPembelian.length}</Typography>
            <Typography variant='body1'>
              Rata-Rata Harga: Rp. {numberSplitter(Math.floor(jumlahTotal.harga / dataPembelian.length))}
            </Typography>
          </Box>
          <Box>
            <Typography variant='body1'>Total Bruto : {numberSplitter(jumlahTotal.bruto)} Kg</Typography>
            <Typography variant='body1'>Rata-Rata Bruto : {Math.floor(jumlahTotal.bruto / dataPembelian.length)} Kg</Typography>
          </Box>
          <Box>
            <Typography variant='body1'>Total Netto : {numberSplitter(jumlahTotal.netto)} Kg</Typography>
            <Typography variant='body1'>Rata-Rata Netto : {Math.floor(jumlahTotal.netto / dataPembelian.length)} Kg</Typography>
          </Box>
          <Box>
            <Typography variant='body1'>Total Jumlah Harga: Rp. {numberSplitter(jumlahTotal.jumlah_harga)} </Typography>
            <Typography variant='body1'>
              Rata-Rata Jumlah Harga: Rp. {numberSplitter(Math.floor(jumlahTotal.jumlah_harga / dataPembelian.length))}
            </Typography>
          </Box>
        </Stack>
      }
    </Box>
  )
}

