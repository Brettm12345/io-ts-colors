import {flow} from 'fp-ts/lib/function'
import * as C from 'io-ts/lib/Codec'
import * as D from 'io-ts/lib/Decoder'
import {Percentage, Positive} from '../types'
import {decodeWithError, div, mult, roundTo} from '../lib'

export const PercentageFromDecimal = C.make<Percentage>(
  D.parse(Positive, flow(mult(100), roundTo(1), decodeWithError(Percentage))),
  {encode: div(100)}
)
