import 'reflect-metadata'
import buildFederatedSchema from '..'
import { TestResolver } from './resolver'

describe('Test federated schema building', () => {
  it('should successfully build schema options', async () => {
    const schema = await buildFederatedSchema({
      resolvers: [TestResolver],
    })

    expect(schema).toBeDefined()
    expect(schema.resolvers).toBeDefined()
    expect(schema.schema).toBeDefined()
  })
})
