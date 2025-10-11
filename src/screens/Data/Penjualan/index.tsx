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
    field: 'jumlah_harga',
    headerName: 'Jumlah Harga (Rp)',
    type: 'number',
    width: 200
  }
];

interface penjualanProps {
  id: number
  no: string
  created_date: string
  kode: string
  harga: number
  bruto: number
  netto: number
  jumlah_harga: number
}

export default function DataPembelian() {

  const { id } = useParams()

  const [dataPenjualan, setDataPenjualan] = useState<penjualanProps[]>([])
  const [jumlahTotal, setJumlahTotal] = useState({
    harga: 0,
    bruto: 0,
    netto: 0,
    jumlah_harga: 0
  })
  const [valueKode, setValueKode] = useState<{ id: number, label: string }[]>([])
  const [filterNomer, setFilterNomer] = useState('')
  const [filterKode, setFilterKode] = useState<string>('')
  const [wilayah, setWilayah] = useState<{ id: number, nama: string }[]>([])

  function sendToFront(params: penjualanProps[]) {
    setDataPenjualan(params)
    setJumlahTotal({
      harga: params.reduce((v: number, n) => v + n.harga, 0),
      bruto: params.reduce((v: number, n) => v + n.bruto, 0),
      netto: params.reduce((v: number, n) => v + n.netto, 0),
      jumlah_harga: params.reduce((v: number, n) => v + n.jumlah_harga, 0)
    })
  }

  async function getKode() {
    const db = await Database.load('sqlite:main.db')
    const kode: { id: number, label: string }[] = await db.select('SELECT id,kode AS label from Kode_Penjualan')
    setValueKode(kode)
  }

  async function getData() {
    const db = await Database.load('sqlite:main.db')
    const dataWilayah = await db.select<{ id: number, nama: string }[]>('SELECT * FROM Wilayah WHERE id = $1', [id])
    const data: penjualanProps[] = await db.select('SELECT Penjualan.*, kode from Penjualan INNER JOIN Kode_Penjualan ON Penjualan.kode_id = Kode_Penjualan.id WHERE wilayah_id = $1',
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
      const data: penjualanProps[] = await db.select('SELECT Penjualan.*, kode from Penjualan INNER JOIN Kode_Pejualan ON Penjualan.kode_id = Kode_Penjualan.id WHERE Penjualan.id = $1 AND wilayah_id = $2',
        [filterNomer, id])
      sendToFront(data)
    }
  }

  async function handleFilterKode(v: { id: number, label: string }) {
    setFilterKode(v?.label)
    if (v.label != '') {
      setFilterNomer('')
      const db = await Database.load('sqlite:main.db')
      const kodeId = valueKode.find(k => k.label == v.label)
      const data: penjualanProps[] = await db.select('SELECT Penjualan.*, kode from Penjualan INNER JOIN Kode_Penjualan ON Penjualan.kode_id = Kode_Penjualan.id WHERE kode_id = $1 AND wilayah_id = $2',
        [kodeId?.id, id])
      sendToFront(data)
    }

  }

  function handleDeleteFilter() {
    getData()
    setFilterKode('')
    setFilterNomer('')
  }

  return (
    <Box>
      <Typography variant='h4'>Data Penjualan {wilayah.length != 0 ? wilayah[0].nama : ''}</Typography>
      <Stack direction='row' marginTop='20px' gap='20px'>
        <TextField
          type='number' label='No.'
          onChange={(e) => {
            setFilterNomer(e.target.value)
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
        {(filterKode != '' || filterNomer != '') &&
          <Button onClick={handleDeleteFilter}>Hapus Filter</Button>
        }
      </Stack>
      <div style={{ margin: "20px 0", display: 'flex', flexDirection: 'column' }}>
        <DataGrid
          rows={dataPenjualan}
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
      {dataPenjualan.length != 0 &&
        <Stack justifyContent='space-between' direction='row' sx={{ p: 4, bgcolor: 'background.paper', bottom: 0, right: 0, left: 0, position: 'sticky' }}>
          <Box>
            <Typography variant='body1'>Total Keranjang: {dataPenjualan.length}</Typography>
            <Typography variant='body1'>Rata-Rata Harga: Rp. {numberSplitter(Math.floor(jumlahTotal.harga / dataPenjualan.length))}</Typography>
          </Box>
          <Box>
            <Typography variant='body1'>Total Bruto : {numberSplitter(jumlahTotal.bruto)} Kg</Typography>
            <Typography variant='body1'>Rata-Rata Bruto : {Math.floor(jumlahTotal.bruto / dataPenjualan.length)} Kg</Typography>
          </Box>
          <Box>
            <Typography variant='body1'>Total Netto : {numberSplitter(jumlahTotal.netto)} Kg</Typography>
            <Typography variant='body1'>Rata-Rata Netto : {Math.floor(jumlahTotal.netto / dataPenjualan.length)} Kg</Typography>
          </Box>
          <Box>
            <Typography variant='body1'>Total Jumlah Harga: Rp. {numberSplitter(jumlahTotal.jumlah_harga)} </Typography>
            <Typography variant='body1'>Rata-Rata Jumlah Harga: Rp. {numberSplitter(Math.floor(jumlahTotal.jumlah_harga / dataPenjualan.length))} </Typography>
          </Box>
        </Stack>
      }
    </Box>
  )
}
