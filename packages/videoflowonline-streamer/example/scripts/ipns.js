const ipfsAPI = require('ipfs-http-client')
const chalk = require('chalk')
const { clearLine } = require('readline')

const { globSource } = ipfsAPI

//const infura = { host: "ipfs.infura.io", port: "5001", protocol: "https" };
// run your own ipfs daemon: https://docs.ipfs.io/how-to/command-line-quick-start/#install-ipfs
const localhost = { host: 'localhost', port: '5001', protocol: 'http' }

const ipfs = ipfsAPI(localhost)

const ipfsGateway = 'https://ipfs.io/ipfs/'
const ipnsGateway = 'https://ipfs.io/ipns/'

const addOptions = {
  pin: true,
}

const publishHashToIPNS = async (ipfsHash) => {
  try {
    const response = await ipfs.name.publish(`/ipfs/${ipfsHash}`)
    return response
  } catch (e) {
    return {}
  }
}

const deploy = async () => {
  let ipnsName = ''
  cid = 'QmSTekcXPfR86LgrhSmm9jCjLkoP4J14vPNtW9j7Ui3vag'
  ipnsName = (await publishHashToIPNS(cid)).name
  clearLine(process.stdout, 0)
  if (!ipnsName) {
    console.log('   Publishing IPNS name on node failed.')
  }
  console.log(`🔖 App published to IPNS with name: ${chalk.cyan(ipnsName)}`)
  console.log()

  console.log(`Use the link${ipnsName && 's'} below to access your app:`)
  console.log(`   IPFS: ${chalk.cyan(`${ipfsGateway}${cid}`)}`)
  if (ipnsName) {
    console.log(`   IPNS: ${chalk.cyan(`${ipnsGateway}${ipnsName}`)}`)
    console.log()
    console.log(
      'Each new deployment will have a unique IPFS hash while the IPNS name will always point at the most recent deployment.',
    )
    console.log(
      'It is recommended that you share the IPNS link so that people always see the newest version of your app.',
    )
  }
  console.log()
  return true
}

deploy()
