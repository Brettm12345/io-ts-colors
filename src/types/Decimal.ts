import * as D from 'io-ts/lib/Decoder'
import {isPositive, PositiveBrand} from './Positive'

interface DecimalBrand {
  readonly Decimal: unique symbol
}
export type Decimal = number & DecimalBrand & PositiveBrand
export const Decimal = D.refinement(
  D.number,
  (n): n is Decimal => isPositive && n <= 1,
  'Decimal'
)
