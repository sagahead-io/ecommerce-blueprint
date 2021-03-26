// import { pubsub } from './federated'
import { EventEmitter } from 'events'

export class GatewayPubSub {
  emitter: EventEmitter
  constructor() {
    this.emitter = new EventEmitter()
  }

  async subscribe(topic, queue) {
    console.log(topic)
    const listener = (value) => {
      queue.push(value)
    }

    const close = () => {
      console.log('closed', topic)
      this.emitter.removeListener(topic, listener)
    }

    this.emitter.on(topic, listener)
    queue.close = close
  }

  publish(event, callback) {
    this.emitter.emit(event.topic, event.payload)
    callback()
  }
}
