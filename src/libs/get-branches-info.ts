import {Context} from '@actions/github/lib/context'
import {IBranchesInfo} from '../interfaces'

export async function getBranchesInfo(
  branchData: any,
  toolKit: any,
  context: Context
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
        branchCommitAuthor: data.commit.author.name,
        branchCommitAuthorDate: data.commit.author.date,
        branchCommitterName: data.commit.committer.name,
        branchCommitterLastUpdate: data.commit.committer.date,
        branchCommitterMessage: data.message
      }
    })
  )
}
