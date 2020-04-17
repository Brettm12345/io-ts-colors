import {either, right} from 'fp-ts/lib/Either'
import {RGBFromHex, rgb, RGB} from './rgb'
import {Decoded} from './util'
;[
  ['#ff0000', rgb(255, 0, 0)],
  ['#191a2a', rgb(25, 26, 42)],
  ['#ffffff', rgb(255, 255, 255)],
].forEach(([hex, rgb]: [string, Decoded<RGB>]) => {
  test('Hex to RGB', () => {
    expect(RGBFromHex.decode(hex)).toEqual(rgb)
  })
  test('RGB to HEX', () => {
    expect(either.map(rgb, RGBFromHex.encode)).toEqual(right(hex))
  })
})
