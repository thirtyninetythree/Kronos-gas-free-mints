import React, { useState } from 'react'

import {
  Alert,
  Button,
  Grid,
  Typography,
  Snackbar,
  CircularProgress,
  Box,
} from '@mui/material'
import './Form.css'

function Form({ mint, txHash, open, handleClose, showLoading }) {
  let now = new Date()
  const etherscan = 'https://kovan.etherscan.io/tx/'

  const [hour, setHour] = useState(now.getHours())
  const [minute, setMinute] = useState(now.getMinutes())
  const [second, setSecond] = useState(now.getSeconds())

  function hour_up() {
    let temp = hour
    temp++
    setHour(temp)
    if (hour >= 23) {
      setHour(0)
    }
  }

  function hour_down() {
    let temp = hour
    temp--
    setHour(temp)
    if (hour <= 0) {
      setHour(23)
    }
  }

  function minute_up() {
    let temp = minute
    temp++
    setMinute(temp)
    if (minute >= 59) {
      setMinute(0)
      hour_up()
    }
  }

  function minute_down() {
    let temp = minute
    temp--
    setMinute(temp)
    if (minute <= 0) {
      setMinute(59)
      hour_down()
    }
  }

  function second_up() {
    let temp = second
    temp++
    setSecond(temp)
    if (second >= 59) {
      setSecond(0)
      minute_up()
      if (minute >= 59) {
        hour_up()
      }
    }
  }

  function second_down() {
    let temp = second
    temp--
    setSecond(temp)
    if (second <= 0) {
      setSecond(59)
      minute_down()
      if (minute <= 0) {
        hour_down()
      }
    }
  }

  const handleSubmit = () => {
    let tokenID = hour * 3600 + minute * 60 + second
    console.log('tokenID' + tokenID)
    mint(tokenID)
  }

  const action = (
    <Alert severity="success">
      <a target="_blank" href={etherscan + txHash} rel="noopener noreferrer">
        View on Etherscan
      </a>
    </Alert>
  )

  return (
    <>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={3}
      >
        <Grid>
          <Typography variant="h2">
            CHOOSE YOUR <b>TIME</b>
          </Typography>
          <div
            className="time-picker"
            // data-time={`${hour}:${minute}:${second}`}
          >
            <div className="hour">
              <div className="hr-up" onClick={hour_up}></div>
              <input
                type="number"
                className="hr"
                readOnly
                value={hour < 10 ? `0${hour}` : hour}
              />
              <div className="hr-down" onClick={hour_down}></div>
            </div>
            <div className="separator">:</div>
            <div className="minute">
              <div className="min-up" onClick={minute_up}></div>
              <input
                type="number"
                className="min"
                readOnly
                value={minute < 10 ? `0${minute}` : minute}
              />
              <div className="min-down" onClick={minute_down}></div>
            </div>
            <div className="separator">:</div>
            <div className="second">
              <div className="sec-up" onClick={second_up}></div>
              <input
                type="number"
                className="sec"
                readOnly
                value={second < 10 ? `0${second}` : second}
              />
              <div className="sec-down" onClick={second_down}></div>
            </div>
          </div>
        </Grid>
        <Grid>
          {showLoading ? (
            <Box sx={{ display: 'flex' }} style={{ marginTop: 20 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Button
              variant="contained"
              onClick={handleSubmit}
              style={{
                marginTop: 20,
                borderRadius: 50,
                padding: 8,
                height: 40,
                width: 160,
                backgroundColor: '#ffe5b4',
                color: 'black',
              }}
            >
              <Typography>
                Mint for <b>0</b> gas
              </Typography>
            </Button>
          )}
        </Grid>
      </Grid>
      {txHash ? (
        <div>
          <Snackbar
            severity="success"
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={open}
            onClose={handleClose}
            message={'MINTED!'}
            action={action}
          />
        </div>
      ) : null}
    </>
  )
}

export default Form
