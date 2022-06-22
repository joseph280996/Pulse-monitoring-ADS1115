export default () =>
  new Promise((resolve: (param: number) => void) => {
    setTimeout(() => resolve(Math.random()), 100)
  })
