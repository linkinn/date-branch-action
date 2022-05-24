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

  const {data: branchData} = await toolKit.rest.repos.listBranches({
    ...context.repo
  })

  const branchesInfo = await Promise.all(
    branchData.map(async branch => {
      const {data} = await toolKit.rest.git.getCommit({
        ...context.repo,
        commit_sha: branch.commit.sha
      })

      return {
        branchName: branch.name,
        branchCommitSha: branch.commit.sha,
        branchCommitUrl: branch.commit.url,
        branchCommitAuthor: data.committer.name,
        branchCommitLastUpdate: data.committer.date,
        branchCommitMessage: data.message
      }
    })
  )

  core.debug(JSON.stringify(branchesInfo))
}
