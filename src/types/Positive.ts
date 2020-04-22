import * as E from 'fp-ts/lib/Either'
import {flow} from 'fp-ts/lib/function'
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
export const isPositive = flow(Positive.decode, E.isRight)
