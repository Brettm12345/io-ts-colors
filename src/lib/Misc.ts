export const debug = (msg: string = '') => <A>(a: A): A => {
  console.log(msg, a)
  return a
}
