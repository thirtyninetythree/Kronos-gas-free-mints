import { useState, useEffect, useRef } from 'react'

import abi from './contracts/Kronos.json'
import { Navbar, Form, Footer } from './components'
import { Box, CircularProgress } from '@mui/material'

const Web3 = require('web3')
const { RelayProvider } = require('@opengsn/provider')
// const address = '0xeF6e882246A973F6191251ef6F8eA679EEA04eD4' //kovan //onlyOwner
const address =  "0x353686dEB35E150DC50af795304d91D3a2f8Ed3F"
// const address = '0x8dF0bA3c28671382Ad301c963b1Ce7FF3Cd3E992' //ropsten

function App() {
  const [connectedAccount, setConnectedAccount] = useState(null)
  const [txHash, setTxHash] = useState(null)
  const [showLoading, setShowLoading] = useState(false)
  const [loadingRelayProvider, setLoadingRelayProvider] = useState(true)
  const [open, setOpen] = useState(false)
  const web3 = useRef(new Web3(window.ethereum))
  const provider = useRef()

  let currentAccount
 
  const paymasterAddress = '0xB19D34ca1A6B37E84cc87E3F7D0893AD897e7b5D' //kovan
  // const paymasterAddress = '0x05319d82fa69EA8434A967CdF4A2699Db4Ff40e8' //ropsten
  const config = {
    paymasterAddress,
    loggerConfiguration: {
      logLevel: 'debug',
      // loggerUrl: 'http://logger.opengsn.org/',
    },
  }

  useEffect(() => {
    window.ethereum.on('accountsChanged', handleAccountsChanged)
    async function load() {
      provider.current = await RelayProvider.newProvider({
        provider: web3.current.currentProvider,
        config,
      }).init()
      web3.current = new Web3(provider.current)
      console.log(
        'after',
        'config=',
        config,
        'sendMethod=',
        Object.keys(web3.current.currentProvider),
      )
      let hasRelayProviderFinishedLoading = Object.keys(
        web3.current.currentProvider,
      )[0]
      if (hasRelayProviderFinishedLoading === 'relayClient') {
        console.log('true')
        setLoadingRelayProvider(false)
      } else {
        console.log('false. this probably indicates an error')
      }
    }

    load()
  }, [])

  async function connect() {
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
    console.log(`accounts.length = ${accounts.length}`)
    if (accounts.length === 0) {
      console.log('Connect to metamask in handle accounts')
      setConnectedAccount(null)
    } else if (accounts[0] !== currentAccount) {
      currentAccount = accounts[0]
      setConnectedAccount(currentAccount)
    }
  }
  const contract = new web3.current.eth.Contract(abi, address)
  async function mint(_tokenID) {
    
    if (!connectedAccount) {
      connect()
      return
    }

    setShowLoading(true)
    await contract.methods
      .safeMint(connectedAccount, _tokenID)
      .send({
        from: connectedAccount,
        to: address,
        gas: 1000000,
        gasLimit: 10000000,
        gasPrice: web3.current.utils.toWei('2', 'gwei'),
      })
      .on('transactionHash', function (hash) {
        setTxHash(hash)
        setOpen(true)
        setShowLoading(false)
      })
      .on('receipt', function (receipt) {
        console.log('Receipt', receipt)
      })
      .on('error', function (error, receipt) {
        console.log('error in safemint ', error)
        setShowLoading(false)
      })
  }
  const handleClose = () => {
    setOpen(false)
  }
  return (
    <div className="App">
      <Navbar connect={connect} connectedAccount={connectedAccount} />
      <Box sx={{ m: 10 }} />
      {loadingRelayProvider ? (
        <Box
          sx={{ display: 'flex' }}
          width={100}
          height={100}
          style={{ margin: 'auto' }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Form
          connect={connect}
          mint={mint}
          txHash={txHash}
          open={open}
          handleClose={handleClose}
          showLoading={showLoading}
        />
      )}
      <br />
      <Footer />
    </div>
  )
}

export default App
