import {either} from 'fp-ts/lib/Either'
import {HSL, hsl, RGB, rgb} from '../types'
import {Decoded} from '../util'
import {HSLFromRGB} from './HSLFromRGB'
;[
  [rgb(255, 0, 0), hsl(0, 100, 50)],
  [rgb(25, 26, 42), hsl(236, 25.4, 13.1)],
  [rgb(255, 255, 255), hsl(0, 0, 1)],
].forEach(([rgb, hsl]: [Decoded<RGB>, Decoded<HSL>], i) =>
  test(`HSL From RGB ${i}`, () => {
    expect(either.chain(rgb, HSLFromRGB.decode)).toEqual(hsl)
  })
)
