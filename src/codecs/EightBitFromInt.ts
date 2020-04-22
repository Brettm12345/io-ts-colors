import {flow} from 'fp-ts/lib/function'
import * as C from 'io-ts/lib/Codec'
import * as D from 'io-ts/lib/Decoder'
import {div, multiply, showError} from '../util'
import {EightBit, Decimal} from '../types'

export const EightBitFromInt = C.make<EightBit>(
  D.parse(Decimal, flow(multiply(255), EightBit.decode, showError)),
  {encode: div(255)}
)
