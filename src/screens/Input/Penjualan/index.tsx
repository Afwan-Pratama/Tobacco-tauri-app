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
import { Controller, SubmitHandler, useForm } from "react-hook-form";

interface IFormInput {
  kode: string
  nama: string
  harga: number
  bruto: number
  netto: number
}

export default function InputPenjualan() {

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      kode: '',
      nama: '',
      harga: 0,
      bruto: 0,
      netto: 0,
    }
  })

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data)
  }

  return (
    <Box>
      <Typography variant="h4">Input Penjualan</Typography>
      <Box component={"section"} sx={{ p: 2, border: '2px solid black', borderRadius: 1 }}>
        <Controller
          name="kode"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <FormControl fullWidth margin="normal">
              <InputLabel >Kode</InputLabel>
              <Select
                error={errors.kode ? true : false}
                label="Kode"
                onChange={onChange}
                value={value}
              >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
              {
                errors.kode && (
                  <FormHelperText error={errors.kode ? true : false}>Inputan masih kosong</FormHelperText>
                )
              }
            </FormControl>

          )} />
        <Controller
          name="nama"
          rules={{ required: true }}
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField margin="normal" label={"Nama"} error={errors.nama ? true : false} helperText={errors.nama ? 'Inputan Salah' : ''} fullWidth onChange={onChange} value={value} />
          )} />
        <Controller
          name="harga"
          rules={{ required: true, pattern: /^[0-9]+$/i }}
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField margin="normal" label={"Harga"} error={errors.harga ? true : false} helperText={errors.harga ? 'Inputan Salah' : ''} fullWidth type="number" slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">Rp</InputAdornment>
              }
            }} onChange={onChange} value={value} />
          )}
        />
        <Controller
          name="bruto"
          rules={{ required: true, pattern: /^[0-9]+$/i, maxLength: 3 }}
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField margin="normal" label={"Bruto"} error={errors.bruto ? true : false} helperText={errors.bruto ? 'Inputan Salah' : ''} fullWidth type="number" slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">Kg</InputAdornment>
              }
            }} onChange={onChange} value={value} />
          )}
        />
        <Controller
          name="netto"
          rules={{ required: true, pattern: /^[0-9]+$/i, maxLength: 3 }}
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField margin="normal" label={"Netto"} error={errors.netto ? true : false} helperText={errors.netto ? 'Inputan Salah' : ''} fullWidth type="number" slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">Kg</InputAdornment>
              }
            }} onChange={onChange} value={value} />
          )}
        />
        <Button variant="contained" sx={{ margin: '20px' }} startIcon={<Print />}>Cetak</Button>
        <Button variant="contained" sx={{ margin: '20px' }} endIcon={<Save />} onClick={handleSubmit(onSubmit)}>Simpan</Button>
      </Box>
    </Box >
  )
}
