import {Do} from 'fp-ts-contrib/lib/Do'
import * as E from 'fp-ts/lib/Either'
import {either} from 'fp-ts/lib/Either'
import {flow, unsafeCoerce} from 'fp-ts/lib/function'
import {pipe} from 'fp-ts/lib/pipeable'
import * as C from 'io-ts/lib/Codec'
import * as D from 'io-ts/lib/Decoder'
import {avg, deltaMax, formatError, indexFrom} from '../lib'
import {Decimal, HSL, hsl, RGB} from '../types'
import {DegreeFromInt} from './DegreeFromInt'
import {EightBitFromInt} from './EightBitFromInt'
import {PercentageFromDecimal} from './PercentageFromDecimal'

export const HSLFromRGB = C.make<HSL>(
  D.parse(
    RGB,
    flow(rgb => {
      const [max, min]: Decimal[] = ['max', 'min'].map(k =>
        Math[k](...rgb.map(EightBitFromInt.encode))
      )
      const delta = max - min
      if (delta === 0) return hsl(0, 0, max) // The color is grayscale
      const sum = max + min
      const d = deltaMax(rgb)
      return Do(either)
        .bind(
          'maxIndex',
          pipe(max, EightBitFromInt.decode, E.map(indexFrom(rgb)))
        )
        .bind('deltaEightBit', EightBitFromInt.decode(delta))
        .bindL('h', ({maxIndex, deltaEightBit}) =>
          pipe(
            2 * maxIndex + (d(1) - d(2)) / deltaEightBit,
            DegreeFromInt.decode
          )
        )
        .bind('l', pipe(avg(max, min), PercentageFromDecimal.decode))
        .bindL('s', ({l}) =>
          pipe(delta / (l > 50 ? 2 - delta : sum), PercentageFromDecimal.decode)
        )
        .return(({h, s, l}): HSL => [h, s, l])
    }, formatError)
  ),
  {encode: unsafeCoerce} // TODO: RGB -> HSL
)
