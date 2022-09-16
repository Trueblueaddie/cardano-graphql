/* eslint-disable camelcase */
import path from 'path'

import { DocumentNode } from 'graphql'
import util from '@cardano-graphql/util'
import { TestClient } from '@cardano-graphql/util-dev'
import { testClient } from './util'

function loadQueryNode (name: string): Promise<DocumentNode> {
  return util.loadQueryNode(path.resolve(__dirname, '..', 'src', 'example_queries', 'assets'), name)
}

describe('assets', () => {
  let client: TestClient
  beforeAll(async () => {
    client = await testClient.testnet()
  })

  it('can return information on assets', async () => {
    const result = await client.query({
      query: await loadQueryNode('assets'),
      variables: {
        limit: 2
      }
    })
    const { assets_aggregate, assets } = result.data
    const { aggregate } = assets_aggregate
    expect(aggregate.count).toBeDefined()
    expect(assets.length).toBeGreaterThan(0)
    expect(assets[0].tokenMints.length).toBeGreaterThan(0)
    expect(parseInt(assets[0].tokenMints_aggregate.aggregate.count)).toBeGreaterThan(0)
    expect(assets[0].fingerprint.slice(0, 5)).toBe('asset')
  })

  it('can return information on assets by fingerprint', async () => {
    const result = await client.query({
      query: await loadQueryNode('assets'),
      variables: {
        where: {
          fingerprint: { _eq: 'asset1r68y4x0edyfmeq2v0kr7nldjamynjpsurjfcg2' }
        }
      }
    })
    const { assets } = result.data
    expect(assets[0].assetId).toBeDefined()
    expect(assets[0].assetName).toBeDefined()
    expect(assets[0].description).toBeDefined()
    expect(assets[0].fingerprint).toBeDefined()
    expect(assets[0].logo).toBeDefined()
    expect(assets[0].name).toBeDefined()
    expect(assets[0].policyId).toBeDefined()
    expect(assets[0].ticker).toBeDefined()
    expect(assets[0].url).toBeDefined()
  })
  it('can return information on assets by assetId', async () => {
    const result = await client.query({
      query: await loadQueryNode('assets'),
      variables: {
        where: {
          _and: [{
            assetId: { _eq: '5e23c65ee5ab33671c742c372d3662930508b3b1d6a9066d6a1aa3e954657374436f696e33' }
          }]
        }
      }
    })
    const { assets } = result.data
    expect(assets[0].assetName).toBe('54657374436f696e33')
    expect(assets[0].decimals).toBe(4)
    expect(assets[0].description).toBe('Test coin (with 3 recommended decimals)')
    expect(assets[0].fingerprint).toBe('asset1r68y4x0edyfmeq2v0kr7nldjamynjpsurjfcg2')
    expect(assets[0].logo).toBe('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')
    expect(assets[0].name).toBe('TestCoin3')
    expect(assets[0].policyId).toBe('5e23c65ee5ab33671c742c372d3662930508b3b1d6a9066d6a1aa3e9')
    expect(assets[0].ticker).toBe('TC3')
    expect(assets[0].url).toBe('https://daedaluswallet.io')
  })
})
