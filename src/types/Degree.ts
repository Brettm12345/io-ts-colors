import {Show} from 'fp-ts/lib/Show'
import * as D from 'io-ts/lib/Decoder'
import {Positive, showPositive} from './Positive'

interface DegreeBrand {
  readonly Degree: unique symbol
}
export type Degree = Positive & DegreeBrand
export const Degree = D.refinement(
  Positive,
  (n): n is Degree => n <= 360,
  'Degree'
)
export const showDegree: Show<Degree> = {
  show: x => `${showPositive.show(x)}deg`,
}
