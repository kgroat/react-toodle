
import * as React from 'react'
import { Subscription } from 'rxjs/Subscription'
import * as PropTypes from 'prop-types'
import { Toodle, FlatMap } from 'toodle'

import { CONTEXT_NAME } from './ToodleProvider'
import { ToodleSubscriber } from './subscriber'

export interface ToodleSubs extends FlatMap<ToodleSubscriber<any>> {
}

export interface Subscribers extends FlatMap<Subscription> {
}

export function toodleConnect<
  Props extends ToodleProps & NonToodleProps,
  ToodleProps extends { [P in keyof TS]: TS[P]['default'] },
  NonToodleProps = {},
  TS extends ToodleSubs = {}
> (getter: (toodle: Toodle) => TS) {
  return (Component: React.ReactType) => {
    return class ToodleWrapper extends React.PureComponent<NonToodleProps, ToodleProps> {
      state = {} as ToodleProps
      subscriptions = {} as FlatMap<Subscription>
      observables: TS

      static contextTypes = {
        [CONTEXT_NAME]: PropTypes.object.isRequired
      }

      componentWillMount () {
        this.observables = getter(this.context[CONTEXT_NAME])
        Object.keys(this.observables).forEach(name => {
          this.subscriptions[name] = this.observables[name].observable.subscribe(val => {
            this.setState((prev: any) => ({ ...prev, [name]: val }))
          })
        })
      }

      componentWillUnmount () {
        Object.values(this.subscriptions)
              .forEach(sub => sub.unsubscribe())
      }

      render () {
        const toodle = this.context[CONTEXT_NAME]
        return <Component {...this.props} {...this.state} />
      }
    }
  }
}
