import {Show, showNumber} from 'fp-ts/lib/Show'
import * as D from 'io-ts/lib/Decoder'

export interface PositiveBrand {
  readonly Positive: unique symbol
}
export type Positive = number & PositiveBrand
export const Positive = D.refinement(
  D.number,
  (n): n is Positive => n >= 0,
  'Positive'
)
export const showPositive: Show<Positive> = showNumber
