import * as core from '@actions/core'
import {WebClient} from '@slack/web-api'

interface ISlack {
  payload: string
  channelID: string
  branchName: string
  repoName: string
  slackToken: string
}

interface IBlocks {
  type: string
  text: any
  accessory?: any
}

export async function slack({
  payload,
  channelID,
  branchName,
  repoName,
  slackToken
}: ISlack): Promise<void> {
  core.debug(`Start slack message...`)

  try {
    const webClient = new WebClient(slackToken)

    const blocks: IBlocks[] = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text:
            payload ||
            `@channel Foi criado a branch ${branchName} fora do padrão no repositorio *${repoName}*, a mesma sera deletada`
        }
      }
    ]

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
