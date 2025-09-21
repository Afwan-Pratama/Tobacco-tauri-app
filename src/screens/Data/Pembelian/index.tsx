import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import Database from '@tauri-apps/plugin-sql';
import { Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'No.', width: 90 },
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
    field: 'jumlah_harga',
    headerName: 'Jumlah Harga (Rp)',
    type: 'number',
    width: 200
  }
];


export default function DataPembelian() {

  const [dataPembelian, setDataPembelian] = useState([])
  const [jumlahTotal, setJumlahTotal] = useState({
    harga: 0,
    bruto: 0,
    netto: 0,
    jumlah_harga: 0
  })
  const [valueKode, setValueKode] = useState([])
  const [filterNomer, setFilterNomer] = useState(0)
  const [filterNama, setFilterNama] = useState('')
  const [filterKode, setFilterKode] = useState(0)

  function sendToFront(params) {
    setDataPembelian(params)
    setJumlahTotal({
      harga: params.reduce((v: number, n: number) => v + n.harga, 0),
      bruto: params.reduce((v: number, n: number) => v + n.bruto, 0),
      netto: params.reduce((v: number, n: number) => v + n.netto, 0),
      jumlah_harga: params.reduce((v: number, n: number) => v + n.jumlah_harga, 0)
    })
  }

  async function getKode() {
    const db = await Database.load('sqlite:test.db')
    const kode = await db.select('SELECT id,kode from Kode')
    setValueKode(kode)

  }

  async function getData() {
    const db = await Database.load('sqlite:test.db')
    const data = await db.select('SELECT Pembelian.id, kode, nama, harga, bruto, netto, jumlah_harga from Pembelian INNER JOIN Kode ON Pembelian.kode_id = Kode.id')
    sendToFront(data)
  }

  useEffect(() => {
    getData()
    getKode()
  }, [])

  async function handleFilterNomer() {
    setFilterKode(0)
    setFilterNama('')
    const db = await Database.load('sqlite:test.db')
    const data = await db.select('SELECT Pembelian.id, kode, nama, harga, bruto, netto, jumlah_harga from Pembelian INNER JOIN Kode ON Pembelian.kode_id = Kode.id WHERE Pembelian.id = $1', [filterNomer])
    sendToFront(data)
  }

  async function handleFilterKode() {
    setFilterNomer(0)
    setFilterNama('')
    const db = await Database.load('sqlite:test.db')
    const data = await db.select('SELECT Pembelian.id, kode, nama, harga, bruto, netto, jumlah_harga from Pembelian INNER JOIN Kode ON Pembelian.kode_id = Kode.id WHERE kode_id = $1', [filterKode])
    sendToFront(data)
  }

  async function handleFilterNama() {
    setFilterNomer(0)
    setFilterKode(0)
    const db = await Database.load('sqlite:test.db')
    const data = await db.select('SELECT Pembelian.id, kode, nama, harga, bruto, netto, jumlah_harga from Pembelian INNER JOIN Kode ON Pembelian.kode_id = Kode.id WHERE nama = $1', [filterNama])
    sendToFront(data)
  }

  function handleDeleteFilter() {
    getData()
    setFilterNama('')
    setFilterKode(0)
    setFilterNomer(0)
  }

  return (
    <Box>
      <Typography variant='h4'>Data Pembelian</Typography>
      <Stack direction='row' gap='20px'>
        <Stack direction='row' gap='20px' alignItems='center'>
          <TextField type='number' label='No.' onChange={(e) => setFilterNomer(e.target.value)} value={filterNomer} />
          {filterNomer != 0 && <Button endIcon={<Search />} onClick={handleFilterNomer} />}
        </Stack>
        <Stack direction='row' gap='20px' alignItems='center'>
          <FormControl sx={{ width: '200px' }}>
            <InputLabel>Kode</InputLabel>
            <Select
              label="Kode"
              onChange={(e) => setFilterKode(e.target.value)}
              value={filterKode}
            >
              {valueKode.map((v) => (
                <MenuItem value={v.id}>{v.kode}</MenuItem>
              ))}
              <MenuItem value={0}></MenuItem>
            </Select>
            {filterKode != 0 && <Button endIcon={<Search />} onClick={handleFilterKode} />}
          </FormControl>
        </Stack>
        <Stack direction='row' gap='20px' alignItems='center'>
          <TextField label='Nama' onChange={(e) => setFilterNama(e.target.value)} value={filterNama} />
          {filterNama != '' && <Button endIcon={<Search />} onClick={handleFilterNama} />}
        </Stack>
        {(filterKode != 0 || filterNomer != 0 || filterNama != '') &&
          <Button onClick={handleDeleteFilter}>Hapus Filter</Button>
        }
      </Stack>
      <div style={{ margin: "20px 0", display: 'flex', flexDirection: 'column' }}>
        <DataGrid
          rows={dataPembelian}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 20,
              },
            },
          }}
          pageSizeOptions={[20]}
          rowHeight={35}
          disableRowSelectionOnClick
        />
      </div>
      <Stack justifyContent='space-between' direction='row' sx={{ p: 4, bgcolor: 'background.paper', bottom: 0, right: 0, left: 0, position: 'sticky' }}>
        <Box>
          <Typography variant='body1'>Total Keranjang: {dataPembelian.length}</Typography>
          <Typography variant='body1'>Rata-Rata Harga: Rp. {Math.floor(jumlahTotal.harga / dataPembelian.length)}</Typography>
        </Box>
        <Box>
          <Typography variant='body1'>Total Bruto : {jumlahTotal.bruto} Kg</Typography>
          <Typography variant='body1'>Rata-Rata Bruto : {Math.floor(jumlahTotal.bruto / dataPembelian.length)} Kg</Typography>
        </Box>
        <Box>
          <Typography variant='body1'>Total Netto : {jumlahTotal.netto} Kg</Typography>
          <Typography variant='body1'>Rata-Rata Netto : {Math.floor(jumlahTotal.netto / dataPembelian.length)} Kg</Typography>
        </Box>
        <Box>
          <Typography variant='body1'>Total Jumlah Harga: Rp. {jumlahTotal.jumlah_harga} </Typography>
          <Typography variant='body1'>Rata-Rata Jumlah Harga: Rp. {Math.floor(jumlahTotal.jumlah_harga / dataPembelian.length)} </Typography>
        </Box>
      </Stack>
    </Box>
  )
}

