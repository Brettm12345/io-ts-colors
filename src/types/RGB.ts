import * as D from 'io-ts/lib/Decoder'
import {Builder} from '../util'
import {EightBit} from './EightBit'

export const RGB = D.tuple(EightBit, EightBit, EightBit)
export const rgb: Builder<RGB> = (...args: RGB) => RGB.decode(args)
export type RGB = D.TypeOf<typeof RGB>
