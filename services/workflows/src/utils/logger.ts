import { BuildLogger } from '@libs/logger'
import env from './env'

export default BuildLogger({
  serviceInstanceId: env.SERVICE,
})
