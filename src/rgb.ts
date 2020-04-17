import * as A from 'fp-ts/lib/Array'
import {array} from 'fp-ts/lib/Array'
import * as E from 'fp-ts/lib/Either'
import {either} from 'fp-ts/lib/Either'
import {constant, flow} from 'fp-ts/lib/function'
import {pipe} from 'fp-ts/lib/pipeable'
import * as C from 'io-ts/lib/Codec'
import * as D from 'io-ts/lib/Decoder'
import {Literal as _, match, Number} from 'runtypes'
import {EightBit, NonEmptyString, IntFromString, showError} from './io'
import {base16, Builder, replaceAll, sum} from './util'

export const HexDigit = C.make<number>(
  D.parse(
    NonEmptyString,
    flow(
      replaceAll(
        ['a', 'b', 'c', 'd', 'e', 'f'].map((a, i) => [a, (i + 10).toString()])
      ),
      IntFromString.decode,
      showError
    )
  ),
  {
    encode: match([_(0), constant('00')], [Number, base16]),
  }
)
export const RGB = D.tuple(EightBit, EightBit, EightBit)
export const rgb: Builder<RGB> = (...args: RGB) => RGB.decode(args)
export type RGB = D.TypeOf<typeof RGB>
export const RGBFromHex = C.make<RGB>(
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
          E.map(sum),
          E.chain(EightBit.decode)
        )
      ),
      array.sequence(either),
      E.bimap(
        JSON.stringify,
        flow(A.reverse, ([r, g, b]) => [r, g, b])
      )
    )
  ),
  {
    encode: rgb => '#' + rgb.map(HexDigit.encode).join(''),
  }
)
