import React from 'react'
import { Container, Typography, Link, Grid } from '@mui/material'
import TwitterIcon from '@mui/icons-material/Twitter'


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://everythingsmartcontracts.com/">
        EverythingSmartContracts
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const social = [
  {
    id: 1,
    name: 'Twitter',
    icon: TwitterIcon,
    link: 'https://twitter.com/0x3093sw',
  },
]

export default function Footer() {

  return (
    <footer>
      <Container>
        {social.map((network) => (
          <Link
            display="block"
            variant="body1"
            href={network.link}
            key={network.id}
            target="_blank"
            rel="noreferrer"
          >
            <Grid container spacing={1} direction="row" justifyContent="center">
              <Grid item>
                <network.icon />
              </Grid>
              <Grid item>{network.name}</Grid>
            </Grid>
          </Link>
        ))}
        <Copyright />
      </Container>
    </footer>
  )
}
