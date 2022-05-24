import * as core from '@actions/core'
import {getOctokit, context} from '@actions/github'
// import {slack} from './slack-send'

function githubToken(): string {
  const token = process.env.GITHUB_TOKEN
  if (!token)
    throw ReferenceError('No token defined in the environment variables')
  return token
}

export async function execute(): Promise<void> {
  const toolKit = getOctokit(githubToken())

  const ref = toolKit.rest.git.getRef({
    ...context.repo,
    ref: context.ref
  })

  core.debug(JSON.stringify(ref))
}