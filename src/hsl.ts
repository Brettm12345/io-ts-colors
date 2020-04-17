import {Do} from 'fp-ts-contrib/lib/Do'
import * as E from 'fp-ts/lib/Either'
import {either} from 'fp-ts/lib/Either'
import {flow, unsafeCoerce} from 'fp-ts/lib/function'
import {pipe} from 'fp-ts/lib/pipeable'
import * as C from 'io-ts/lib/Codec'
import * as D from 'io-ts/lib/Decoder'
import {
  Decimal,
  Degree,
  DegreeFromNumber,
  EightBitFromDecimal,
  Percentage,
  PercentFromNumber,
  showError,
} from './io'
import {RGB} from './rgb'
import {avg, Builder, deltaMax, indexFrom} from './util'

const HSL = D.tuple(Degree, Percentage, Percentage)
export type HSL = D.TypeOf<typeof HSL>
export const hsl: Builder<HSL> = (...args: HSL) => HSL.decode(args)
export const HSLFromRGB = C.make<HSL>(
  D.parse(
    RGB,
    flow(rgb => {
      const [max, min]: Decimal[] = ['max', 'min'].map(k =>
        Math[k](...rgb.map(EightBitFromDecimal.encode))
      )
      const delta = max - min
      if (delta === 0) return hsl(0, 0, max) // The color is grayscale
      const sum = max + min
      const d = deltaMax(rgb)
      return Do(either)
        .bind(
          'maxIndex',
          pipe(max, EightBitFromDecimal.decode, E.map(indexFrom(rgb)))
        )
        .bind('deltaEightBit', EightBitFromDecimal.decode(delta))
        .bindL('h', ({maxIndex, deltaEightBit}) =>
          pipe(
            DegreeFromNumber.decode(
              2 * maxIndex + (d(1) - d(2)) / deltaEightBit
            )
          )
        )
        .bind('l', PercentFromNumber.decode(avg(max, min)))
        .bindL('s', ({l}) =>
          PercentFromNumber.decode(delta / (l > 50 ? 2 - delta : sum))
        )
        .return(({h, s, l}): HSL => [h, s, l])
    }, showError)
  ),
  {encode: unsafeCoerce} // TODO
)
