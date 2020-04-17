import {Do} from 'fp-ts-contrib/lib/Do'
import {either} from 'fp-ts/lib/Either'
import {flow, unsafeCoerce, constant} from 'fp-ts/lib/function'
import {pipe} from 'fp-ts/lib/pipeable'
import * as E from 'fp-ts/lib/Either'
import * as C from 'io-ts/lib/Codec'
import * as D from 'io-ts/lib/Decoder'
import {RGB} from './rgb'
import {Degree, EightBit, Percentage} from './units'
import {avg, deltaMax, multiply, roundTo, Builder} from './util'

const {round} = Math

const HSL = D.type({
  h: Degree,
  s: Percentage,
  l: Percentage,
})
export type HSL = D.TypeOf<typeof HSL>
export const hsl: Builder<HSL> = (h, s, l) => HSL.decode({h, s, l})
const percent = flow(multiply(100), roundTo(1), Percentage.decode)
export const HSLFromRGB: C.Codec<HSL> = C.make(
  D.parse(
    RGB,
    flow(({r, g, b}) => {
      const tuple = [r, g, b]
      const [max, min] = ['max', 'min'].map(k => Math[k](...tuple) / 255)
      const delta = max - min
      if (delta === 0)
        return pipe(
          hsl(0, 0, max) // The color is grayscale
        )
      const sum = max + min
      const maxIndex = tuple.indexOf((max * 255) as EightBit)
      const d = deltaMax(tuple)
      return Do(either)
        .bindL('h', () =>
          Degree.decode(
            round((60 * (2 * maxIndex + (d(1) - d(2)) / (delta * 255))) % 360)
          )
        )
        .bindL('l', () => percent(avg(max, min)))
        .bindL('s', ({l}) => percent(delta / (l > 50 ? 2 - delta : sum)))
        .done()
    }, E.mapLeft(constant('Failed to parse hsl')))
  ),
  {encode: unsafeCoerce} // TODO
)
