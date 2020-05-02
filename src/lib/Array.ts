import {ISO} from './Fp'
import {Endomorphism as Endo} from 'fp-ts/lib/function'
import {Show} from 'fp-ts/lib/Show'

export const getShow = <A>(prefix: string, S: Show<A>): Show<A[]> => ({
  show: xs => `${prefix}(${xs.map(S.show).join(' ')})`,
})

/**
 * Return the element `n` slots away from the maximum value in the array.
 * Cycling back to the first value after reaching the end.
 */
export const deltaMax: ISO<number[], Endo<number>> = xs => n =>
  xs[(xs.indexOf(Math.max(...xs)) + n) % xs.length]

export const indexed = <A>(xs: A[]) => xs.map((x, i) => [i, x])
export const indexFrom = <A>(xs: A[]) => (x: A) => xs.indexOf(x)
