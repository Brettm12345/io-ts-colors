import {Show} from 'fp-ts/lib/Show'
import * as D from 'io-ts/lib/Decoder'
import {Positive} from './Positive'

export interface PercentageBrand {
  readonly Percentage: unique symbol
}
export type Percentage = Positive & PercentageBrand
export const Percentage = D.refinement(
  Positive,
  (n): n is Percentage => n <= 100,
  'Percentage'
)
export const showPercentage: Show<Percentage> = {
  show: x => `${x}%`,
}
