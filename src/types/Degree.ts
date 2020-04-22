import * as D from 'io-ts/lib/Decoder'
import {isPositive, Positive, PositiveBrand} from './Positive'

interface DegreeBrand {
  readonly Degree: unique symbol
}
export type Degree = number & DegreeBrand & PositiveBrand
export const Degree = D.refinement(
  Positive,
  (n): n is Degree => isPositive(n) && n <= 360,
  'Degree'
)
