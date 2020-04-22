import * as D from 'io-ts/lib/Decoder'
import {Positive} from './Positive'

export interface PercentageBrand {
  readonly Percentage: unique symbol
}
export type Percentage = number & PercentageBrand & Positive
export const Percentage = D.refinement(
  Positive,
  (n): n is Percentage => n <= 100,
  'Percentage'
)
