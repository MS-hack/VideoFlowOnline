// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
const url = 'https://livepeer.com/api/stream/?streamsonly=1'
const { livePeerToken } = require('../../.secret.json')
const streamAPI = async (req, res) => {
  const streams = await axios.get(url, {
    headers: {
      Authorization: 'Bearer ' + livePeerToken,
    },
  })
  const actives = streams.data.filter((i) => i.isActive)
  res.status(200).json(actives)
}
export default streamAPI
