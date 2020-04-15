import {Do} from 'fp-ts-contrib/lib/Do'
import {either} from 'fp-ts/lib/Either'
import {flow, unsafeCoerce} from 'fp-ts/lib/function'
import {pipe} from 'fp-ts/lib/pipeable'
import * as t from 'io-ts'
import {RGB} from './rgb'
import {Degree, EightBit, Percentage} from './units'
import {avg, Decoder, deltaMax, multiply, roundTo} from './util'

const {round} = Math

const HSL = t.type({h: Degree, s: Percentage, l: Percentage})
export type HSL = t.TypeOf<typeof HSL>
export const hsl: Decoder<HSL> = (h, s, l) => HSL.decode({h, s, l})
const percent = flow(multiply(100), roundTo(1), Percentage.decode)
export const HSLFromRGB = new t.Type<HSL, RGB, unknown>(
  'HSLFromRGB',
  HSL.is,
  (u, c) =>
    pipe(
      either.chain(RGB.validate(u, c), ({r, g, b}) => {
        const tuple = [r, g, b]
        const [max, min] = ['max', 'min'].map(k => Math[k](...tuple) / 255)
        const delta = max - min
        if (delta === 0) return hsl(0, 0, max) // The color is grayscale
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
      })
    ),
  unsafeCoerce // TODO: Convert RGB TO HSL
)
