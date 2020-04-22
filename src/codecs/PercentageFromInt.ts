import {flow} from 'fp-ts/lib/function'
import * as C from 'io-ts/lib/Codec'
import * as D from 'io-ts/lib/Decoder'
import {Percentage, Positive} from '../types'
import {div, multiply, roundTo, showError} from '../util'

export const PercentFromInt = C.make<Percentage>(
  D.parse(
    Positive,
    flow(multiply(100), roundTo(1), Percentage.decode, showError)
  ),
  {encode: div(100)}
)
