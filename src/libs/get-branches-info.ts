import * as core from '@actions/core'
import {Context} from '@actions/github/lib/context'
import {IBranchesInfo} from '../interfaces'

export async function getBranchesInfo(
  branchData: any,
  toolKit: any,
  context: Context
): Promise<IBranchesInfo[]> {
  return await Promise.all(
    branchData.map(async (branch: any) => {
      // criar lista de branch que nao vai ser preciso ser avaliada
      if (branch.name.startsWith('dependabot')) {
        return
      }
      core.debug(branch)

      const {data} = await toolKit.rest.git.getCommit({
        ...context.repo,
        commit_sha: branch.commit.sha
      })

      core.debug(data)

      return {
        branchName: branch.name,
        branchCommitSha: branch.commit.sha,
        branchCommitUrl: branch.commit.url,
        branchCommitAuthor: data.author.name,
        branchCommitAuthorDate: data.author.date,
        branchCommitterName: data.committer.name,
        branchCommitterLastUpdate: data.committer.date,
        branchCommitterMessage: data.message
      }
    })
  )
}
