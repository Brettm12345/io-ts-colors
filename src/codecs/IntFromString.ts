import * as E from 'fp-ts/lib/Either'
import {constant, flow, not} from 'fp-ts/lib/function'
import * as C from 'io-ts/lib/Codec'
import * as D from 'io-ts/lib/Decoder'
import {NonEmptyString} from '../types/NonEmptyString'

export const IntFromString = C.make(
  D.parse(
    NonEmptyString,
    flow(parseInt, E.fromPredicate(not(isNaN), constant('Error: Not a number')))
  ),
  {encode: String}
)
