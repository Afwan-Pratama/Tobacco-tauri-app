import { createHashRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import { createTheme, ThemeProvider } from '@mui/material'
import GlobalStyles from '@mui/material/GlobalStyles'
import { startVariable } from './commons/startVariable'

const drawerWidth: number = 240;

const theme = createTheme({
  components: {
    MuiInputBase: {
      defaultProps: {
        disableInjectingGlobalStyles: true
      }
    }
  }
})

function Root(): React.JSX.Element {

  startVariable()

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={{
          '@keyframes mui-auto-fill': { from: { display: 'block' } },
          '@keyframes mui-auto-fill-cancel': { from: { display: 'block' } },
        }}
      />
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Sidebar drawerWidth={drawerWidth} />
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >
          <Toolbar />
          <Outlet />
        </Box>
      </Box>

    </ThemeProvider>
  )
}

function makeLazyFunc(
  importedFile: Promise<Record<'default', React.ComponentType>>
) {
  return async () => {
    const component = await importedFile
    return { Component: component.default }
  }
}

const router = createHashRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        lazy: makeLazyFunc(import('./screens/Dashboard'))
      },
      {
        path: 'input-pembelian/:id',
        lazy: makeLazyFunc(import('./screens/Input/Pembelian'))
      },
      {
        path: 'input-penjualan/:id',
        lazy: makeLazyFunc(import('./screens/Input/Penjualan'))
      },
      {
        path: 'data-pembelian/:id',
        lazy: makeLazyFunc(import('./screens/Data/Pembelian'))
      },
      {
        path: 'data-penjualan/:id',
        lazy: makeLazyFunc(import('./screens/Data/Penjualan'))
      },
      {
        path: 'laporan-laba-rugi',
        lazy: makeLazyFunc(import('./screens/Report/LabaRugi'))
      },
      {
        path: 'laporan-bonus',
        lazy: makeLazyFunc(import('./screens/Report/Bonus'))
      },
      {
        path: 'kelola-kode-pembelian',
        lazy: makeLazyFunc(import('./screens/Manage/KodePembelian'))
      },
      {
        path: 'kelola-kode-penjualan',
        lazy: makeLazyFunc(import('./screens/Manage/KodePenjualan'))
      },
      {
        path: 'kelola-wilayah',
        lazy: makeLazyFunc(import('./screens/Manage/Wilayah'))
      },
      {
        path: 'nota-khusus',
        lazy: makeLazyFunc(import('./screens/NotaKhusus'))
      },
      // {
      //   path: 'input-ket-pembelian',
      //   lazy: makeLazyFunc(import('./screens/InputKetPembelian'))
      // },
      // {
      //   path: 'data-ket-pembelian',
      //   lazy: makeLazyFunc(import('./screens/Data/KeteranganPembelian'))
      // },
      {
        path: '*',
        element: <Navigate replace to="/" />
      }
    ]
  }
])

export default function App() {
  return <RouterProvider router={router} />
}
