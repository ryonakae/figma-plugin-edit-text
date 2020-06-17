class Util {
  public wait(ms: number): Promise<void> {
    return new Promise((resolve): void => {
      setTimeout((): void => {
        resolve()
      }, ms)
    })
  }

  public toBoolean(str: string): boolean {
    return str.toLowerCase() === 'true'
  }
}

export default new Util()
