"use strict"

const fetch = require('node-fetch')

function parseBody (body) {
  const bodyArray = body.split('&')

  const bodyObject = bodyArray.reduce(
    (accumulator, currentValue) => {
      const keyValue = currentValue.split('=')

      accumulator[keyValue[0]] = keyValue[1]

      return accumulator
    }, {}
  )
  return bodyObject
}

module.exports.projectStats = async event => {
  const body = parseBody(event.body)
  const projectID = body.text
  const taskingManagerURL = `https://tasks.hotosm.org/api/v1/project/${projectID}/summary`
  const projectURL = `https://tasks.hotosm.org/project/${projectID}`
  const taskingManagerResponse = await fetch(taskingManagerURL)
  const taskingManagerJSON = await taskingManagerResponse.json()

  const {
    projectPriority, 
    projectId, 
    name, 
    shortDescription, 
    organisationTag, 
    campaignTag, 
    mapperLevel, 
    percentMapped, 
    percentValidated
  } = taskingManagerJSON
  
  const slackMessage = {
    blocks: [
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Priority*: ${projectPriority}`
          },
                  {
            type: "mrkdwn",
            text: `*Level*: ${mapperLevel}`
          }
        ]
      },
      {
        "type": "divider"
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `<${projectURL}|${projectId} - ${name}*>`
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${shortDescription}`
        }
      },
          {
        type: "divider"
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Organisation*: ${organisationTag}`
          },
          {
            type: "mrkdwn",
            text: `*Campaign*: ${campaignTag}`
          },
          {
            type: "mrkdwn",
            text: `*${percentMapped}%* Mapped`
          },
          {
            type: "mrkdwn",
            text: `*${percentValidated}%* Validated`
          }
        ]
      }
    ]
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(slackMessage)
  }
}