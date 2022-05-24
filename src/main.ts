import * as core from '@actions/core'
import {execute} from './date-branch'

async function run(): Promise<void> {
  try {
    core.debug(new Date().toTimeString())
    await execute()
    core.debug(new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
