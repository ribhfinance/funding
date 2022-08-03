import { useEffect, useState } from 'react';
import React from 'react';
import { Connection, PublicKey, clusterApiUrl, ConfirmOptions } from '@solana/web3.js';
import { Program, AnchorProvider, web3, utils, BN, Idl } from '@project-serum/anchor';
import './App.css';
import './types/index.d';
import idlFile from './idl.json';
import { Buffer } from 'buffer';
window.Buffer = Buffer

const idl = JSON.parse(JSON.stringify(idlFile))

const programID = new PublicKey('HczGDGW1cPdKURuNtfVUwvbKXFMcyhGifejtonfr83VS')
// const programID = new PublicKey(idlFile.metadata)
const network = clusterApiUrl('devnet')
const opts: ConfirmOptions = {
      preflightCommitment: 'recent',
      commitment: 'recent',
    }

const { SystemProgram } = web3

const App = () => {

  const [walletAddress, setWalletAddress] = useState(null);

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment)
    const provider = new AnchorProvider(connection, window.solana, opts)
    return provider
  }

  const checkIfWalletIsConnected = async () => {
    try {
      if ('solana' in window) {
        const provider = window.solana as any;
        if (provider.isPhantom) {
          console.log("Phantom wallet found");
          const response = await provider.connect({
            onlyIfTrusted: true
          })
          console.log("Connected with public key: ", response.publicKey.toString())
          setWalletAddress(response.publicKey.toString())
        } else {
          alert('Solana object not found: Get a Phantom wallet');
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    const solana = window.solana as any;
    if (solana) {
      const response = await solana.connect()
      console.log("Connected with public key: ", response.publicKey.toString())
      setWalletAddress(response.publicKey.toString())

    }
  }
 
  const createLiquidityPool = async () => {
    try {
      const provider = getProvider()
      const program = new Program(idl, programID, provider)
      const [liquidityPool] = await PublicKey.findProgramAddress([
        utils.bytes.utf8.encode('MY-FIRST-LP'),
        provider.wallet.publicKey.toBuffer()
      ], program.programId)
      await program.rpc.create('Jesselton Building 3A', 'New apartment in Jesselton', {
        accounts: {
          liquidityPool,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId
        }
      })
      console.log('Create an lp with address: ', liquidityPool.toString())
    } catch (err) {
      console.log(err)
    }
  }

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet}>Connect to wallet</button>
  )

  const renderConnectedContainer = () => (
    <button onClick={createLiquidityPool}>Create an LP</button>
  )

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    }

    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, [])

  return (<div className='app'>
    {!walletAddress && renderNotConnectedContainer()}
    {walletAddress && renderConnectedContainer()}
    </div>)

}

export default App;
