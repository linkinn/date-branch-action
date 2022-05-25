import * as core from '@actions/core'
import {WebClient} from '@slack/web-api'
import {ISlack, IBlocks, IBranchesInfo} from './interfaces'

function blockMessage(repoName: string): IBlocks[] {
  const blocks: IBlocks[] = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `@channel :patying_face::patying_face::patying_face: *Braches aniversariantes da semana do repositorio \`${repoName}\`* :sweat::sweat::sweat:`
      }
    }
  ]

  return blocks
}

function createBlock(branchesInfo: IBranchesInfo): IBlocks {
  const {
    branchCommitAuthor, // Criado da branch
    branchCommitLastUpdate, // Colocar logica de data
    branchName
  } = branchesInfo

  const block: IBlocks = {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `> \`${branchCommitAuthor}\`, sua branch \`${branchName}\` está a \`${branchCommitLastUpdate}\` sem receber atualizações`
    }
  }

  return block
}

function blockThread(branchesInfo: IBranchesInfo[]): IBlocks[] {
  const blocks: IBlocks[] = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `:warning::construction::put_litter_in_its_place: \`Fiquem atentos, em breve bracnhes com mais de 30 dias sem atualização serão removidas automaticamente\``
      }
    }
  ]

  for (const branchInfo of branchesInfo) {
    // criar lista de branch que nao vai ser preciso ser avaliada
    if (branchInfo.branchName.startsWith('dependabot')) {
      continue
    }
    blocks.push(createBlock(branchInfo))
  }

  return blocks
}

export async function slack({
  channelID,
  branchesInfo,
  repoName,
  slackToken,
  threadTS
}: ISlack): Promise<void> {
  core.debug(`Start slack message...`)

  try {
    const webClient = new WebClient(slackToken)
    let blocks: IBlocks[] = []

    if(threadTS) {
      blocks = blockThread(branchesInfo)
    } else {
      blocks = blockMessage(repoName)
    }

    const {message} = await webClient.chat.postMessage({
      mrkdwn: true,
      blocks,
      channel: channelID
    })

    const thread_ts = message?.ts
    if (thread_ts) {
      core.setOutput('thread_ts', thread_ts)
    }

    core.debug(`time: ${new Date().toTimeString()}`)
  } catch (e: any) {
    throw new Error(e)
  }
}
