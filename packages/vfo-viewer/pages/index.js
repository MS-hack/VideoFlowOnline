import Head from 'next/head'
import { useEffect, useState, useRef } from 'react'
import ReactPlayer from 'react-player'
import Web3Modal from 'web3modal'
import SuperfluidSDK, {
  setTruffleContractDefaults,
} from '@superfluid-finance/js-sdk'
const { Web3Provider } = require('@ethersproject/providers')
const defaultReceiver = ''
var bob

import { ethers } from 'ethers'

const shortAddress = (address) => {
  if (address.length === 42) {
    return address.slice(0, 6).concat('...'.concat(address.slice(-4)))
  }
}

export default function Home() {
  const playerRef = useRef()
  const [actives, setActives] = useState([])
  const [loading, setLoading] = useState(true)
  const [value, setValue] = useState('')
  const [address, setAddress] = useState('')
  const [chainId, setChainId] = useState('')
  const [network, setNetwork] = useState('')
  const [receiver, setReceiver] = useState(defaultReceiver)
  const [currentReceiver, setCurrentReceiver] = useState('')
  const [url, setUrl] = useState('')

  const notInList = (i, a) => {
    console.log('i', i)
    let arr = []
    for (var i = 0, l = a.length; i < l; i++) {
      arr.push(a[i].name)
    }
    console.log('arr2', arr)
    if (arr.includes(i)) {
      return true
    }
  }
  const equalStreams = (a, b) => {
    console.log('a array', a)
    console.log('b array', b)
    let arr = []
    if (a.length !== b.length) {
      return false
    } else {
      for (var i = 0, l = a.length; i < l; i++) {
        arr.push(a[i].name)
      }
      console.log('arr', arr)
      for (var i = 0, l = b.length; i < l; i++) {
        console.log(i, b[i].name)
        if (!arr.includes(b[i].name)) {
          console.log('return false')
          return false
        }
      }
      console.log('return true')
      return true
    }
  }
  const startSuperFlow = async (provider) => {
    console.log('sf')
    const sf = new SuperfluidSDK.Framework({
      ethers: provider,
      version: 'v1', //"test"
      tokens: ['fDAI'],
    })
    console.log('sf', sf)
    await sf.initialize()
    return sf
  }
  async function bootstrap() {
    const providerOptions = {
      /* See Provider Options Section */
    }

    const web3Modal = new Web3Modal({
      //network: 'ropsten', // optional
      cacheProvider: true, // optional
      providerOptions, // required
    })

    const provider = await web3Modal.connect()
    if (typeof provider !== 'undefined') {
      const address = await provider.selectedAddress
      console.log('address:', address)
      setAddress(shortAddress(address))
      let network = await provider.chainId
      setChainId(network)
      console.log('provider:', provider)
      const provider2 = new Web3Provider(provider)
      const sf = await startSuperFlow(provider2)
      const signer = provider2.getSigner()
      const sender = await signer.getAddress()
      console.log('⚡🌙 🌄❤️💖 🔑🎛💧💬📟🏷🌐💯📚💄☀️⚛️ ✨💵🔗🏷🗺 signer', sender)
      bob = sf.user({ address: sender, token: sf.tokens.fDAIx.address })

      checkNewStream()
      startNewFlow()

      const url_chainid = '/api/networks?chainId=' + network
      console.log('url_chainid', url_chainid)
      fetch(url_chainid)
        .then((res) => res.json())
        .then((array) => {
          console.log('current chain', array)
          if (array.length > 0) {
            setNetwork(array[0].name)
          }
        })
    }
  }

  const stopFlow = async () => {
    console.log('bob', bob)
    if (currentReceiver !== '' && typeof bob !== 'undefined') {
      console.log('stop flow', currentReceiver)
      await bob.flow({
        recipient: currentReceiver,
        flowRate: '0', // 10000 tokens / mo
      })
    }
  }
  const startNewFlow = async (receiver) => {
    console.log('bob', bob)
    if (receiver !== '' && typeof bob !== 'undefined') {
      console.log('start to flow', receiver)
      await bob.flow({
        recipient: receiver,
        //  flowRate: '3858024691358', // 10 tokens / mo -> '3858024691358'
        flowRate: '277784691358', // 1 tokens / hour -> '277784691358'
      })
    }
    setCurrentReceiver(receiver)
  }
  useEffect(async () => {
    stopFlow().then(console.log)
    startNewFlow(receiver).then(console.log)
    if (typeof bob !== 'undefined') {
      const details = await bob.details()
      console.log(details)
    }
  }, [receiver])

  useEffect(() => {
    const timer = window.setInterval(() => {
      console.log('check stream value', value)
      scanStream()
    }, 3000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    bootstrap()
  }, [])

  useEffect(() => {
    console.log('value', value)
    if (value !== '') {
      setUrl(
        'https://cdn.livepeer.com/hls/' + JSON.parse(value).id + '/index.m3u8',
      )
    }
    console.log('new url', url)
  }, [value])

  const scanStream = () => {
    fetch('/api/streams')
      .then((res) => res.json())
      .then((array) => {
        console.log('array', array)
        console.log('actives', actives)
        if (!equalStreams(array, actives)) {
          setActives(array)
          if (array.length === 1 || notInList(receiver, array)) {
            console.log('actives', array)
            const newUrl = JSON.stringify({
              id: array[0].playbackId,
              name: shortAddress(array[0].name),
              address: array[0].name,
            })
            console.log('new url', newUrl)
            setValue(newUrl)
            setReceiver(array[0].name)
            setUrl(
              'https://cdn.livepeer.com/hls/' +
                array[0].playbackId +
                '/index.m3u8',
            )
          }
        }
      })
  }

  const checkNewStream = () => {
    fetch('/api/streams')
      .then((res) => res.json())
      .then((array) => {
        console.log('array', array)
        console.log('actives', actives)
        if (!equalStreams(array, actives)) {
          setActives(array)
          setLoading(false)
          if (array.length > 0) {
            console.log('actives', array)
            const newUrl = JSON.stringify({
              id: array[0].playbackId,
              name: shortAddress(array[0].name),
              address: array[0].name,
            })
            console.log('new url', newUrl)
            setValue(newUrl)
            setReceiver(array[0].name)
            setUrl(
              'https://cdn.livepeer.com/hls/' +
                array[0].playbackId +
                '/index.m3u8',
            )
          }
        }
      })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>{receiver}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <p> {address} </p>
      <p>{url}</p>
      <p>{value}</p>
      <ReactPlayer
        controls="true"
        playing="true"
        url={url}
        volume="0.8"
        muted="false"
      />
      <>
        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
          <button className="btn btn-primary">{network}</button>
          <h1 className="text-1l font-bold">select stream to watch </h1>
          <select
            className="text-6xl font-bold bg-yellow"
            disabled={loading}
            value={value}
            onChange={(e) => {
              const json = JSON.parse(e.currentTarget.value)
              console.log('json', json)
              setValue(e.currentTarget.value)
              setReceiver(json.address)
            }}
          >
            {actives.map((active, i) => (
              <option
                key={i}
                value={JSON.stringify({
                  id: active.playbackId,
                  name: shortAddress(active.name),
                  address: active.name,
                })}
              >
                {shortAddress(active.name)}
              </option>
            ))}
          </select>
        </main>
      </>
      <footer className="flex items-center justify-center w-full h-24 border-t">
        <a
          className="flex items-center justify-center"
          href="https://vfo-viewer-mingder78.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/VFO.png" alt="Vercel Logo" className="h-20 ml-2" />
        </a>
      </footer>
    </div>
  )
}
