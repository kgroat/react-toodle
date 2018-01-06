
import * as React from 'react'
import * as PropTypes from 'prop-types'
import { Toodle } from 'toodle'

export interface ToodleProviderProps {
  toodle: Toodle
}

export interface ToodleProviderState {

}

export const CONTEXT_NAME = 'toodle'

export class ToodleProvider extends React.PureComponent<ToodleProviderProps, ToodleProviderState> {

  static childContextTypes = {
    [CONTEXT_NAME]: PropTypes.object,
  }

  getChildContext () {
    const { toodle } = this.props
    return {
      [CONTEXT_NAME]: toodle,
    }
  }

  render () {
    return this.props.children as any
  }
}
