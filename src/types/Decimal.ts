import * as D from 'io-ts/lib/Decoder'
import {Positive, showPositive} from './Positive'

interface DecimalBrand {
  readonly Decimal: unique symbol
}
export type Decimal = Positive & DecimalBrand
export const Decimal = D.refinement(
  Positive,
  (n): n is Decimal => n <= 1,
  'Decimal'
)
export const showDecimal = showPositive
