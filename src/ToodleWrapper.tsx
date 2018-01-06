
import * as React from 'react'
import { Subscription } from 'rxjs/Subscription'
import * as PropTypes from 'prop-types'
import { Toodle, FlatMap, Getters } from 'toodle'

import { ToodleSubscriber } from './subscriber'

export interface ToodleSubs extends FlatMap<ToodleSubscriber<any>> {
}
export interface Subscribers extends FlatMap<Subscription> {
}

export type ComponentType<Props> = React.ComponentClass<Props> | React.StatelessComponent<Props>

export function toodleWrap<TS extends ToodleSubs, T extends Toodle> (subs: TS) {
  return function wrap<MainProps> (Component: React.ComponentClass<MainProps & { [P in keyof TS]: TS[P]['default'] }>) {
    return class ToodleWrapper extends React.PureComponent<MainProps, { [P in keyof TS]: TS[P]['default'] }> {
      state = {} as { [P in keyof TS]: TS[P]['default'] }
      subscriptions = {} as FlatMap<Subscription>

      componentWillMount () {
        Object.keys(subs).forEach(name => {
          this.subscriptions[name] = subs[name].observable.subscribe(val => {
            this.setState((prev: any) => ({ ...prev, [name]: val }))
          })
        })
      }

      componentWillUnmount () {
        Object.values(this.subscriptions)
              .forEach(sub => sub.unsubscribe())
      }

      render () {
        return <Component {...this.props} {...this.state} />
      }
    }
  }
}
