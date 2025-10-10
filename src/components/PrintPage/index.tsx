import Save from "@mui/icons-material/Save";
import Print from "@mui/icons-material/Print";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print"
import { Grid } from "@mui/material";

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
}

export default function PrintPage(props: PrintPageProps) {

  const { dataPembelian, dataBiaya, biayaAkhir, jumlahTotal, totalAkhir, handleOnlySave } = props

  const contentRef = useRef(null);

  const reactToPrint = useReactToPrint({ contentRef })

  async function handlePrint() {
    reactToPrint()
    handleOnlySave()
  }

  async function handleOnlyPrint() {
    reactToPrint()
  }

  return (
    <Box>
      <Box sx={{ border: '2px solid black' }} display='none' >
        <Box ref={contentRef} >
          <Stack marginX='200px' marginTop='50px' justifyContent='space-between' height='450px'>
            <Box>
              <Stack justifyContent='space-between' direction='row' sx={{ padding: '10px' }}>
                <Stack>
                  <Typography variant="caption">Kode : {dataPembelian.length != 0 ? dataPembelian[0].kode_id : ''}</Typography>
                  <Typography variant="caption">Tanggal : {dataPembelian.length != 0 ? dataPembelian[0].created_date : ''}</Typography>
                </Stack>
                <Typography variant="caption">Kepada : {dataPembelian.length != 0 ? dataPembelian[0].nama : ''}</Typography>
              </Stack>
              <Grid container spacing={2} sx={{ border: '2px solid black' }}>
                <Grid size={2}>
                  <Typography variant="caption">GIRIK</Typography>
                </Grid>
                <Grid size={1}>
                  <Typography variant="caption">BK</Typography>
                </Grid>
                <Grid size={1}>
                  <Typography variant="caption">BB</Typography>
                </Grid>
                <Grid size={3}>
                  <Typography variant="caption">HARGA</Typography>
                </Grid>
                <Grid size={5} textAlign='right'>
                  <Typography variant="caption">JUMLAH HARGA</Typography>
                </Grid>
              </Grid>
              {dataPembelian.map((v, i: number) => (
                <Grid key={i} container spacing={2} >
                  <Grid size={2}>
                    <Typography variant="caption">{v.no}</Typography>
                  </Grid>
                  <Grid size={1}>
                    <Typography variant="caption">{v.bruto}</Typography>
                  </Grid>
                  <Grid size={1}>
                    <Typography variant="caption">{v.netto}</Typography>
                  </Grid>
                  <Grid size={3}>
                    <Typography variant="caption">x {v.harga}</Typography>
                  </Grid>
                  <Grid size={5} textAlign='right'>
                    <Typography variant="caption">{v.jumlah_harga}</Typography>
                  </Grid>
                </Grid>
              ))}
            </Box>
            {dataPembelian.length != 0 && (
              <Box>
                <Stack direction='row' sx={{ border: '2px solid black' }} justifyContent='space-between'>
                  <Typography variant="caption">JUMLAH</Typography>
                  <Typography variant="caption">Rp. {jumlahTotal.harga}</Typography>
                </Stack>
                <Stack direction='row'>
                  <Typography variant="caption">JUMLAH KERANJANG : {dataPembelian.length}</Typography>
                </Stack>
                <Stack direction='row' justifyContent='space-between'>
                  <Typography variant="caption">LAIN-LAIN : </Typography>
                  <Typography variant="caption">Rp. {biayaAkhir.pajak}</Typography>
                </Stack>
                <Stack direction='row' justifyContent='space-between'>
                  <Typography variant="caption">ROKOK : Rp. {dataBiaya?.rokok}</Typography>
                  <Typography variant="caption">x {biayaAkhir.jumlah_rokok}</Typography>
                  <Typography variant="caption">Rp. {biayaAkhir.rokok}</Typography>
                </Stack>
                <Stack direction='row' justifyContent='space-between'>
                  <Typography variant="caption">BAYAR : </Typography>
                  <Typography variant="caption">Rp. {totalAkhir}</Typography>
                </Stack>
              </Box>
            )}
          </Stack>
        </Box>
      </Box>
      {dataPembelian.length != 0 && (
        <Stack marginTop='20px' direction='row' justifyContent='space-between'>
          <Button onClick={handleOnlySave} startIcon={<Save />}>Hanya Simpan</Button>
          <Button onClick={handleOnlyPrint} startIcon={<Print />}>Hanya Print</Button>
          <Button onClick={handlePrint} endIcon={<Print />}>Print & Simpan</Button>
        </Stack>
      )}
    </Box>
  )
}
