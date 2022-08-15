import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TwitterIcon from '@mui/icons-material/Twitter'
import logo from '../../assets/logo.png'

export default function Navbar({ connect, connectedAccount }) {
  function formatAddress(address) {
    return `${address.slice(0, 6)}...${connectedAccount.slice(
      address.length - 4,
      address.length,
    )}`
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        style={{
          width: '90%',
          backgroundColor: '#fff',
          borderRadius: 50,
          paddingLeft: 30,
          paddingRight: 30,
          alignSelf: 'center',
          justifyContent: 'center',
          margin: 'auto',
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <img
              alt="logo"
              src={logo}
              style={{ width: 40, borderRadius: '50%' }}
            />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
            style={{ color: 'black' }}
          >
            Kronos
          </Typography>
          <TwitterIcon style={{ color: 'black' }} />
          <Box></Box>
          <Button style={{ color: 'black' }} onClick={connect}>
            {connectedAccount !== null
              ? formatAddress(connectedAccount)
              : 'CONNECT'}
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
