import type { NextApiRequest, NextApiResponse } from 'next'

// eslint-disable-next-line no-unused-vars
const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    const pricesResponse = await Promise.any([
      fetch('https://fd60qhijvtes7do71ou6moc14s.ingress.pcgameservers.com/api/prices'),
      fetch('https://9c0pbpbijhepr6ijm4lk85uiuc.ingress.europlots.com/api/prices'),
    ])

    const guppyWhalePoolResponse = await fetch('https://ww-migaloo-rest.polkachu.com/cosmwasm/wasm/v1/contract/migaloo14p3r422qp04p345mnqe5umjy3vqx75hpxf54f8enf59wf27fksvqltavjp/smart/eyJwb29sIjp7fX0=')

    if (!pricesResponse.ok) {
      throw new Error(`Failed to fetch prices: ${pricesResponse.status}`)
    }

    if (!guppyWhalePoolResponse.ok) {
      throw new Error(`Failed to fetch guppy whale pool: ${guppyWhalePoolResponse.status}`)
    }

    const guppyWhalePool = await guppyWhalePoolResponse.json()
    const [guppy, whale] = guppyWhalePool?.data?.assets || []
    const prices = (await pricesResponse.json()).data
    const whalePrice = prices['white-whale']?.usd ?? 0

    if (!guppy || !whale) {
      throw new Error('Guppy or whale data is missing')
    }

    prices.guppy = { usd: Number(((Number(whale?.amount ?? 0)) / (Number(guppy?.amount ?? 0))) * (Number(whalePrice) ?? 0)).toFixed(10) }
    res.status(200).json({ data: prices })
  } catch (error) {
    if (error instanceof AggregateError) {
      console.error('All price fetch attempts failed:', error.errors)
      res.status(500).json({ error: 'All price fetch attempts failed' })
    } else {
      console.error('Unexpected error:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
}

export default handler
