
import { LCDClient } from "@terra-money/feather.js";
import tokens from "./tokens.json"
import {num} from "libs/num";

type PoolInfo = {
    denom: string
    deimals: number
    contract: string
    base?: boolean
    basedOn?: string
    chainId: string
    name: string
}

type TokenPrice = {
    [key: string]: number
}

const getLCDClient = (chainId: string) => {
    return new LCDClient({
        'migaloo-1': {
            lcd: 'https://ww-migaloo-rest.polkachu.com/',
            chainID: 'migaloo-1',
            gasAdjustment: 0.1,
            gasPrices: { uwhale: 0.05 },
            prefix: 'migaloo',
        },
        'phoenix-1': {
            lcd: 'https://ww-terra-rest.polkachu.com/',
            chainID: 'phoenix-1',
            gasAdjustment: 1.75,
            gasPrices: { uluna: 0.015 },
            prefix: 'terra',
        },
    });
}

const getPriceFromPool = ({ denom, deimals, contract, base, basedOn, chainId }: PoolInfo, basePrice?: TokenPrice): Promise<number> => {

    const client = getLCDClient(chainId)

    return client.wasm
        .contractQuery(contract, { pool: {} })
        .then((response: any) => {
            if (base) {
                const [asset1, asset2] = response?.assets || []
                const isAB = asset1.info.native_token?.denom === denom
                if (isAB)
                    return num(asset2.amount).div(asset1.amount).dp(deimals).toNumber()
                else
                    return num(asset1.amount).div(asset2.amount).dp(deimals).toNumber()
            } else {
                const [asset1, asset2] = response?.assets || []
                const aToken = asset1.info.native_token?.denom || asset1.info.token?.contract_addr
                const bToken = asset2.info.native_token?.denom || asset2.info.token?.contract_addr
                const isAB = aToken === basedOn

                if (!basePrice || !basedOn) return 0

                if (isAB)
                    return num(asset1.amount).div(asset2.amount).times(basePrice[basedOn]).dp(deimals).toNumber()
                else
                    return num(asset2.amount).div(asset1.amount).times(basePrice[basedOn]).dp(deimals).toNumber()
            }

        })
}



const getPrice = (tokens: PoolInfo[], basePrice?: TokenPrice) => {
    const promises = tokens.map(token => getPriceFromPool(token, basePrice))
    return Promise.all(promises).then(prices => {
        const tokenPrice: TokenPrice = {}
        tokens.forEach((token, index) => {
            tokenPrice[token.name] = prices[index]
        })
        return tokenPrice
    })
}

export const getTokenPrice = async (): Promise<[TokenPrice, number]> => {

    //group by base tokens to make sure we get base price before other tokens
    const baseTokens = tokens.filter(token => token.base)
    const otherTokens = tokens.filter(token => !token.base)


    const basePrice = await getPrice(baseTokens)
    const otherPrice = await getPrice(otherTokens, basePrice)

    return [{ ...basePrice, ...otherPrice }, new Date().getTime()]


}