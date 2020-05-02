import {Endomorphism as Endo} from 'fp-ts/lib/function'
import {Functions, ISO} from './Fp'

type Search = string | RegExp
type Replacement = [Search, string]

export const {append, prepend}: Functions<string> = {
  append: x => y => x + y,
  prepend: x => y => y + x,
}
export const replaceAll: ISO<Replacement[], Endo<string>> = xs => x =>
  xs.reduce((b, a) => b.replace(...a), x)
export const base16: ISO<number, string> = x => x.toString(16)
