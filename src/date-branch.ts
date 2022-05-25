import * as core from '@actions/core'
import {getOctokit, context} from '@actions/github'
import {IBranchesInfo, IDateBranch} from './interfaces'
import {slack} from './slack-send'

function githubToken(): string {
  const token = process.env.GITHUB_TOKEN
  if (!token)
    throw ReferenceError('No token defined in the environment variables')
  return token
}

async function getBranchesInfo(
  branchData: any,
  toolKit: any
): Promise<IBranchesInfo[]> {
  return await Promise.all(
    branchData.map(async (branch: any) => {
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
}

export async function execute({
  channelID,
  threadTS
}: IDateBranch): Promise<void> {
  const toolKit = getOctokit(githubToken())

  const {data: branchData} = await toolKit.rest.repos.listBranches({
    ...context.repo
  })

  const branchesInfo = await getBranchesInfo(branchData, toolKit)

  core.debug(JSON.stringify(branchesInfo))

  if (branchesInfo.length === 0) {
    return
  }

  const slackToken = process.env.SLACK_TOKEN

  if (!slackToken) {
    return
  }

  await slack({
    channelID,
    branchesInfo,
    repoName: context.repo.repo,
    slackToken,
    threadTS
  })
}
