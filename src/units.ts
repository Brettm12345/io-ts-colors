import * as t from 'io-ts'

interface EightBitBrand {
  readonly EightBit: unique symbol
}
export const EightBit = t.brand(
  t.number,
  (n): n is t.Branded<number, EightBitBrand> => n >= 0 && n <= 255,
  'EightBit'
)
export type EightBit = t.TypeOf<typeof EightBit>

interface PercentageBrand {
  readonly Percentage: unique symbol
}
export const Percentage = t.brand(
  t.number,
  (n): n is t.Branded<number, PercentageBrand> => n >= 0 && n <= 100,
  'Percentage'
)
export type Percentage = t.TypeOf<typeof Percentage>

interface DegreeBrand {
  readonly Degree: unique symbol
}
export const Degree = t.brand(
  t.number,
  (n): n is t.Branded<number, DegreeBrand> => n >= 0 && n <= 360,
  'Degree'
)
export type Degree = t.TypeOf<typeof Degree>
