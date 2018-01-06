
import { Observable } from 'rxjs/Observable'
import { Toodle } from 'toodle'

export interface ToodleSubscriber<O> {
  observable: Observable<O>
  default?: O
}

export function subscribe<O, T extends Toodle = any> (observable: Observable<O>): ToodleSubscriber<O> {
  return {
    observable,
  }
} 
