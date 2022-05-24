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

  const {data} = await toolKit.rest.repos.listBranches({
    ...context.repo
  })

  // const dates = await toolKit.rest.repos.listCommits({
  //   ...context.repo
  // })

  const commit = await toolKit.rest.git.getCommit({
    ...context.repo,
    commit_sha: 'f57250356fcb19241b0a2c4b1d29c8f83d719fc8'
  })

  const branchesName = data.map(branch => branch.name)

  core.debug(JSON.stringify(branchesName))
  // core.debug(JSON.stringify(dates))
  core.debug(JSON.stringify(commit))
}
