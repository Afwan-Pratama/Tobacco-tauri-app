import { Print } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import Database from "@tauri-apps/plugin-sql";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print"

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

interface biayaPembelianProps {
  administrasi: number
  pajak: number
  rokok: number
  mod_rokok: number
}

interface biayaAkhirProps {
  administrasi: number
  pajak: number
  rokok: number
  jumlah_rokok: number
}

interface jumlahTotalProps {
  harga: number
  bruto: number
  netto: number
}

type PrintPageProps = {
  dataPembelian: pembelianProps[]
  dataBiaya: biayaPembelianProps | undefined
  biayaAkhir: biayaAkhirProps
  jumlahTotal: jumlahTotalProps
  totalAkhir: number
  handleOnlySave: () => void
  handleClose: () => void
}

export default function PrintPage(props: PrintPageProps) {

  const { dataPembelian, dataBiaya, biayaAkhir, jumlahTotal, totalAkhir, handleOnlySave, handleClose } = props

  const [kode, setKode] = useState('')

  const date = new Date()
  const contentRef = useRef(null);

  const reactToPrint = useReactToPrint({ contentRef })

  async function handlePrint() {
    reactToPrint()
    handleClose()
    handleOnlySave()
  }

  async function getData() {
    const db = await Database.load('sqlite:test.db')
    const getKode: { kode: string }[] = await db.select('SELECT kode from Kode WHERE id = $1', [dataPembelian[0].kode_id])
    setKode(getKode[0].kode)
  }

  useEffect(() => {
    if (dataPembelian != undefined) {
      getData()
    }
  }, [dataPembelian])

  return (
    <Box>
      <Box sx={{ border: '2px solid black' }}>
        <Box ref={contentRef}>
          <Stack marginTop='200px' justifyContent='space-between'>
            <Box>
              <Stack justifyContent='space-between' direction='row' sx={{ padding: '10px' }}>
                <Box>
                  <Typography variant="body2">Kode : {kode}</Typography>
                  <Typography variant="body2">Tanggal : {`${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`}</Typography>
                </Box>
                <Typography variant="body2">Kepada : {dataPembelian[0].nama}</Typography>
              </Stack>
              <Stack direction='row' sx={{ border: '2px solid black' }} justifyContent='space-between'>
                <Typography variant="body2">GIRIK</Typography>
                <Typography variant="body2">BK</Typography>
                <Typography variant="body2">BB</Typography>
                <Typography variant="body2">HARGA</Typography>
                <Typography variant="body2">JUMLAH HARGA</Typography>
              </Stack>
              {dataPembelian.map((v, i: number) => (
                <Stack key={i} direction='row' justifyContent='space-between'>
                  <Typography variant="body2">{v.id}</Typography>
                  <Typography variant="body2">{v.bruto}</Typography>
                  <Typography variant="body2">{v.netto}</Typography>
                  <Typography variant="body2">x Rp. {v.harga}</Typography>
                  <Typography variant="body2">Rp. {v.jumlah_harga}</Typography>
                </Stack>
              ))}
            </Box>
            <Box>
              <Stack direction='row' sx={{ border: '2px solid black' }} justifyContent='space-between'>
                <Typography variant="body2">JUMLAH</Typography>
                <Typography variant="body2">Rp. {jumlahTotal.harga}</Typography>
              </Stack>
              <Stack direction='row'>
                <Typography variant="body2">JUMLAH KERANJANG : {dataPembelian.length}</Typography>
              </Stack>
              <Stack direction='row' justifyContent='space-between'>
                <Typography variant="body2">ADMINISTRASI     : Rp.{dataBiaya?.administrasi}</Typography>
                <Typography variant="body2">Rp. {biayaAkhir.administrasi}</Typography>
              </Stack>
              <Stack direction='row' justifyContent='space-between'>
                <Typography variant="body2">PAJAK : {dataBiaya?.pajak}%</Typography>
                <Typography variant="body2">Rp. {biayaAkhir.pajak}</Typography>
              </Stack>
              <Stack direction='row' justifyContent='space-between'>
                <Typography variant="body2">ROKOK : Rp. {dataBiaya?.rokok}</Typography>
                <Typography variant="body2">x {biayaAkhir.jumlah_rokok}</Typography>
                <Typography variant="body2">Rp. {biayaAkhir.rokok}</Typography>
              </Stack>
              <Stack direction='row' justifyContent='space-between'>
                <Typography variant="body2">BAYAR : </Typography>
                <Typography variant="body2">Rp. {totalAkhir}</Typography>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Box>
      <Button sx={{ marginTop: '20px' }} onClick={handlePrint} startIcon={<Print />}>Print & Simpan</Button>
    </Box>
  )
}
