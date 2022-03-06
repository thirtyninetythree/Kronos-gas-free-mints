import { useState, useEffect } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'

import abi from './contracts/Kronos.json'
import { Navbar, Form, Footer } from './components'
import { Box } from '@mui/material'
import { useRef } from 'react'

const Web3 = require('web3')
const { RelayProvider } = require('@opengsn/provider')
const address = '' //left blank intentionally

function App() {
  const [connectedAccount, setConnectedAccount] = useState(null)
  const [txHash, setTxHash] = useState(null)
  const [open, setOpen] = useState(false)
  const web3 = useRef(new Web3(window.ethereum))

  let currentAccount
  const paymasterAddress = '0xdA78a11FD57aF7be2eDD804840eA7f4c2A38801d' // kovan testnet
  const config = {
    paymasterAddress,
    loggerConfiguration: {
      logLevel: 'debug',
      // loggerUrl: 'logger.opengsn.org',
    },
  }
  var fromAddress

  useEffect(() => {
    async function load() {
      const provider = await RelayProvider.newProvider({
        provider: window.ethereum,
        config,
      }).init()

      web3.current = new Web3(provider)
      fromAddress = provider.newAccount().address
      console.log(`fromAddress = ${fromAddress}`)
      window.ethereum.on('accountsChanged', handleAccountsChanged)
    }
    load()
  })

  useEffect(() => {
    window.ethereum.on('accountsChanged', handleAccountsChanged)
  }, [connectedAccount])

  const contract = new web3.current.eth.Contract(abi, address)
  contract.setProvider(web3.current.currentProvider)
  async function connect() {
    console.log('connecting..')
    if (typeof window.ethereum === 'undefined') {
      console.log('Install metamask')
      return
    }

    await window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then(handleAccountsChanged)
      .catch((err) => {
        if (err.code === 4001) {
          console.log('We need to connect for the website to function')
        } else {
          console.log('Oops an error has occurred' + err)
        }
      })
  }
  function handleAccountsChanged(accounts) {
    if (accounts?.length === 0) {
      console.log('Connect to metamask in handle accounts')
    } else if (accounts[0] !== currentAccount) {
      currentAccount = accounts[0]
      setConnectedAccount(currentAccount)
    }
  }

  function mint(_tokenID) {
    console.log(`connectedAccount ${connectedAccount}`)
    console.log(`fromAddress ${fromAddress}`)
   
    contract.methods
      .safeMint(connectedAccount, _tokenID)
      .send({ from: connectedAccount })
      .on('transactionHash', function (hash) {
        setTxHash(hash)
        setOpen(true)
      })
      .on('receipt', function (receipt) {
        console.log('Receipt', receipt)
      })
      .on('error', function (error, receipt) {
        console.log('error', error)
        console.log('receipt', receipt)
      })
  }
  const handleClose = () => {
    setOpen(false)
  }
  return (
    <div className="App">
      <Navbar connect={connect} connectedAccount={connectedAccount} />
      <Box sx={{ m: 10 }} />
      <Form
        connect={connect}
        mint={mint}
        txHash={txHash}
        open={open}
        handleClose={handleClose}
      />
      <br />
      {txHash ?? null}
      <Box sx={{ m: 20 }} />
      <Footer />
    </div>
  )
}

export default App
