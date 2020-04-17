import * as A from 'fp-ts/lib/Array'
import {array} from 'fp-ts/lib/Array'
import * as E from 'fp-ts/lib/Either'
import {either} from 'fp-ts/lib/Either'
import {constant, flow} from 'fp-ts/lib/function'
import {monoidString, monoidSum} from 'fp-ts/lib/Monoid'
import {pipe} from 'fp-ts/lib/pipeable'
import {fold} from 'fp-ts/lib/Semigroup'
import * as C from 'io-ts/lib/Codec'
import * as D from 'io-ts/lib/Decoder'
import {Literal as _, match, Number} from 'runtypes'
import {IntFromString} from './numbers'
import {EightBit, NonEmptyString} from './units'
import {Builder, replaceAll} from './util'

const base16 = (x: number): string => x.toString(16)

export const HexDigit: C.Codec<number> = C.make(
  D.parse(
    NonEmptyString,
    flow(
      replaceAll(
        ['a', 'b', 'c', 'd', 'e', 'f'].map((a, i) => [a, (i + 10).toString()])
      ),
      IntFromString.decode,
      E.mapLeft(constant('Failed to parse hex digit'))
    )
  ),
  {
    encode: match([_(0), constant('00')], [Number, base16]) as (
      x: number
    ) => string,
  }
)
export const RGB = D.type({
  r: EightBit,
  g: EightBit,
  b: EightBit,
})
export const rgb: Builder<RGB> = (r, g, b) => RGB.decode({r, g, b})
export type RGB = D.TypeOf<typeof RGB>
export const RGBFromHex: C.Codec<RGB> = C.make(
  D.parse(D.string, s =>
    pipe(
      s.replace(/^#/, '').split('').reverse(),
      s => (s.length === 3 ? s.concat(s) : s), // handle shorthand colors IE: #fff
      A.chunksOf(2),
      A.map(
        flow(
          A.mapWithIndex((i, a) =>
            pipe(
              HexDigit.decode(a),
              E.map(x => (i <= 0 ? x : x * (i * 16)))
            )
          ),
          array.sequence(either),
          E.chain(flow(x => fold(monoidSum)(0, x), EightBit.decode))
        )
      ),
      array.sequence(either),
      E.bimap(
        constant('Failed to parse hex digit'),
        flow(A.reverse, ([r, g, b]) => ({r, g, b}))
      )
    )
  ),
  {
    encode: ({r, g, b}) =>
      '#' +
      pipe(
        [r, g, b],
        A.foldMap(monoidString)(flow(HexDigit.encode, x => x as string))
      ),
  }
)
