class Util {
  public wait(ms: number): Promise<void> {
    return new Promise((resolve): void => {
      setTimeout((): void => {
        resolve()
      }, ms)
    })
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public asyncSetTimeout(ms: number, func = () => {}) {
    let timeoutId
    let r
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const exec = () =>
      new Promise(res => {
        r = res
        timeoutId = setTimeout(async () => {
          timeoutId = null
          await func()
          res()
        }, ms)
      })
    return {
      exec,
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      cancel: () => {
        if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = null
          r()
        }
      }
    }
  }

  public toBoolean(str: string): boolean {
    return str.toLowerCase() === 'true'
  }
}

export default new Util()
