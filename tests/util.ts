import { clearTimeout, clearInterval } from 'node:timers'

import isEqual from 'lodash/isEqual'
import { expect } from 'vitest'

import type { SpyInstance } from 'vitest'

interface Options {
  checkInterval?: number
  bailTimeout?: number
}
export async function waitUntilTrue(
  expression: () => boolean,
  { checkInterval = 500, bailTimeout = 5000 }: Options = {},
): Promise<true> {
  return new Promise((resolve, reject) => {
    const tooLongInterval = setTimeout(() => {
      reject(new Error('too long'))
    }, bailTimeout)

    const cancelCheck = setInterval(() => {
      if (expression()) {
        clearInterval(cancelCheck)
        clearTimeout(tooLongInterval)
        resolve(true)
      }
    }, checkInterval)
  })
}

export async function waitUntiltoHaveBeenCalledWith(
  spy: SpyInstance,
  expectedCallArguments: unknown[],
  options?: Options,
): Promise<void> {
  try {
    await waitUntilTrue(
      () =>
        spy.mock.calls.some((callArgument) =>
          isEqual(callArgument, expectedCallArguments),
        ),
      options,
    )
  } catch {
    expect(spy).toHaveBeenCalledWith(...expectedCallArguments)
  } finally {
    expect(spy).toHaveBeenCalledWith(...expectedCallArguments)
  }
}
