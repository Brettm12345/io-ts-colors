import {Show} from 'fp-ts/lib/Show'
import * as D from 'io-ts/lib/Decoder'
import {Builder, getShow} from '../lib'
import {EightBit, showEightBit} from './EightBit'

export const RGB = D.tuple(EightBit, EightBit, EightBit)
export const rgb: Builder<RGB> = (...args) => RGB.decode(args)
export type RGB = D.TypeOf<typeof RGB>
export const showRGB: Show<RGB> = getShow('rgb', showEightBit)
