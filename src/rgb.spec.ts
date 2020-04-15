import {either, right} from 'fp-ts/lib/Either'
import {HexToRGB, rgb, RGB} from './rgb'
import {Parsed} from './util'
;[
  ['#ff0000', rgb(255, 0, 0)],
  ['#191a2a', rgb(25, 26, 42)],
  ['#ffffff', rgb(255, 255, 255)],
].forEach(([hex, rgb]: [string, Parsed<RGB>]) => {
  test('Hex to RGB', () => {
    expect(HexToRGB.decode(hex)).toEqual(rgb)
  })
  test('RGB to HEX', () => {
    expect(either.map(rgb, HexToRGB.encode)).toEqual(right(hex))
  })
})
