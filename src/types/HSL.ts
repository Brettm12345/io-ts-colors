import {Show} from 'fp-ts/lib/Show'
import * as D from 'io-ts/lib/Decoder'
import {Builder} from '../lib'
import {Degree, showDegree} from './Degree'
import {Percentage, showPercentage} from './Percentage'

const HSL = D.tuple(Degree, Percentage, Percentage)
export type HSL = D.TypeOf<typeof HSL>
export const hsl: Builder<HSL> = (...args) => HSL.decode(args)
export const showHsl: Show<HSL> = {
  show: ([h, s, l]) =>
    `hsl(${[showDegree.show(h)]
      .concat([s, l].map(showPercentage.show))
      .join(' ')}
    )})`,
}
