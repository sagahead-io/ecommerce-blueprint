import { authGuard } from './auth-guard'

describe('authGuard', () => {
  it('should successfully create instance', async () => {
    const guard = await authGuard()

    expect(guard).toBeDefined()
  })
})
