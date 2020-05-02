import {Show} from 'fp-ts/lib/Show'
import * as D from 'io-ts/lib/Decoder'
import {Positive, showPositive} from './Positive'

interface EightBitBrand {
  readonly EightBit: unique symbol
}
export type EightBit = Positive & EightBitBrand
export const EightBit = D.refinement(
  Positive,
  (n): n is EightBit => n <= 255,
  'EightBit'
)
export const showEightBit: Show<EightBit> = showPositive
