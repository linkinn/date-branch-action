export interface IDateBranch {
  channelID: string
  threadTS: string
}

export interface IBranchesInfo {
  branchName: string
  branchCommitSha: string
  branchCommitUrl: string
  branchCommitAuthor: string
  branchCommitLastUpdate: string
  branchCommitMessage: string
}

export interface ISlack {
  channelID: string
  branchesInfo: IBranchesInfo[]
  repoName: string
  slackToken: string
  threadTS: string
}

export interface IBlocks {
  type: string
  text: any
  accessory?: any
}
