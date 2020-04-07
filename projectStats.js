'use strict'

const fetch = require('node-fetch')
const { parseBody } = require('./utils')

const createSlackResponse = (blocks) => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      blocks: blocks,
    }),
  }
}

module.exports.projectStats = async (event) => {
  const body = parseBody(event.body)
  const projectID = body.text

  const projectIdHasNonDigit = !!projectID.match(/\D/)
  if (projectIdHasNonDigit) {
    const invalidIdBlock = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: ':x: Invalid project ID',
        },
      },
    ]
    return createSlackResponse(invalidIdBlock)
  }

  const taskingManagerURL = `https://tasks.hotosm.org/api/v1/project/${projectID}/summary`

  const taskingManagerResponse = await fetch(taskingManagerURL)
  const taskingManagerJSON = await taskingManagerResponse.json()

  if (taskingManagerJSON.Error) {
    const errorBlock = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `:x: ${taskingManagerJSON.Error}`,
        },
      },
    ]

    return createSlackResponse(errorBlock)
  }

  // Change null values in data to 'N/A' instead for readability
  for (const data in taskingManagerJSON) {
    if (taskingManagerJSON[data] === null) {
      taskingManagerJSON[data] = 'N/A'
    }
  }

  const {
    projectPriority,
    projectId,
    name,
    shortDescription,
    organisationTag,
    campaignTag,
    mapperLevel,
    percentMapped,
    percentValidated,
    status,
  } = taskingManagerJSON

  const projectURL = `https://tasks.hotosm.org/project/${projectID}`

  const successBlock = [
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Priority*: ${projectPriority}`,
        },
        {
          type: 'mrkdwn',
          text: `*Level*: ${mapperLevel}`,
        },
      ],
    },
    {
      type: 'divider',
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `<${projectURL}|*${projectId} - ${name}*>`,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${status}* - ${shortDescription}`,
      },
    },
    {
      type: 'divider',
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Organisation*: ${organisationTag}`,
        },
        {
          type: 'mrkdwn',
          text: `*Campaign*: ${campaignTag}`,
        },
        {
          type: 'mrkdwn',
          text: `*${percentMapped}%* Mapped`,
        },
        {
          type: 'mrkdwn',
          text: `*${percentValidated}%* Validated`,
        },
      ],
    },
  ]

  return createSlackResponse(successBlock)
}
