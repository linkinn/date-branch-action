import * as core from '@actions/core'
import {WebClient} from '@slack/web-api'
import {ISlack, IBlocks, IBranchesInfo} from './interfaces'

function createBlock(branchesInfo: IBranchesInfo): IBlocks {
  const {
    branchCommitAuthor,
    branchCommitLastUpdate,
    branchCommitMessage,
    branchCommitUrl,
    branchName
  } = branchesInfo

  const message = `${branchCommitMessage.slice(0, 40)}...`

  const block: IBlocks = {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `> Nome da Branch: \`${branchName}\`\n> URL Ultimo Commit: \`${branchCommitUrl}\`\n> Autor do Ultimo Commit: \`${branchCommitAuthor}\`\n> Data do Ultimo Commit: \`${branchCommitLastUpdate}\`\n> Mensagem do Commit: \`${message}\``
    }
  }

  return block
}

export async function slack({
  channelID,
  branchesInfo,
  repoName,
  slackToken
}: ISlack): Promise<void> {
  core.debug(`Start slack message...`)

  try {
    const webClient = new WebClient(slackToken)

    const blocks: IBlocks[] = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `Repositorio ${repoName} tem branches aniversariantes`
        }
      }
    ]

    for (const branchInfo of branchesInfo) {
      blocks.push(createBlock(branchInfo))
    }

    await webClient.chat.postMessage({
      mrkdwn: true,
      blocks,
      channel: channelID
    })

    core.debug(`time: ${new Date().toTimeString()}`)
  } catch (e: any) {
    throw new Error(e)
  }
}
