import {either} from 'fp-ts/lib/Either'
import {Decoded} from '../lib'
import {HSL, hsl, RGB, rgb} from '../types'
import {HSLFromRGB} from './HSLFromRGB'
;[
  [rgb(25, 26, 42), hsl(236, 25.4, 13.1)],
  [rgb(255, 0, 0), hsl(0, 100, 50)],
  [rgb(255, 255, 255), hsl(0, 0, 1)],
].forEach(([rgb, hsl]: [Decoded<RGB>, Decoded<HSL>]) =>
  test(`RGB: ${rgb} to HSL: ${hsl}`, () => {
    expect(either.chain(rgb, HSLFromRGB.decode)).toEqual(hsl)
  })
)
