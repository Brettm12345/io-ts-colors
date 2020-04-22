import * as D from 'io-ts/lib/Decoder'
import {Degree} from './Degree'
import {Percentage} from './Percentage'
import {Builder} from '../util'

const HSL = D.tuple(Degree, Percentage, Percentage)
export type HSL = D.TypeOf<typeof HSL>
export const hsl: Builder<HSL> = (...args) => HSL.decode(args)
