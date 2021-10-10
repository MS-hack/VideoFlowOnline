// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
const { covalenKey } = require('../../.secret.json')
const url = 'https://api.covalenthq.com/v1/chains/?key=' + covalenKey
const networkAPI = async (req, res) => {
  const networks = await axios.get(url, {
    headers: {
      Accept: 'application/json',
    },
  })
  const q = req.query
  networks.data.data.items.push(
    {
      "name": "eth-ropsten",
      "chain_id": "3",
      "is_testnet": true,
      "db_schema_name": "chain_eth_ropsten",
      "label": "Ethereum Testnet Ropsten",
      "logo_url": "https://www.covalenthq.com/static/images/icons/display-icons/ethereum-eth-logo.png"
      }
  )
  networks.data.data.items.push(
    {
      "name": "eth-rinkeby",
      "chain_id": "4",
      "is_testnet": true,
      "db_schema_name": "chain_eth_rinkeby",
      "label": "Ethereum Testnet Rinkeby",
      "logo_url": "https://www.covalenthq.com/static/images/icons/display-icons/ethereum-eth-logo.png"
      }
  )
  const result = networks.data.data.items.filter(
    i => (i.chain_id === q.chainId)
  )
  res.status(200).json(result)
}
export default networkAPI
