import { BuildLogger } from '@commons/logger'
import env from './env'

export default BuildLogger({
  serviceInstanceId: env.SERVICE,
})
