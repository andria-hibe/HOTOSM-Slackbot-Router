"use strict"

const fetch = require('node-fetch')

const GITHUB_URL = 'https://api.github.com/repos/hotosm/tasking-manager/issues?state=open;labels=Difficulty:%20Easy'

function groupIssuesIntoMessages (array, size) {
  const blocksArray = []

  for (let i = 0; i < array.length; i++) {
    const lastBlock = blocksArray[blocksArray.length - 1]
    
    if (!lastBlock || lastBlock.length === size) {
      blocksArray.push([array[i]])
    } else {
      lastBlock.push(array[i])
    }
  }
  return blocksArray.map(block => {
    return {
      blocks: block
    }
  })
}

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

module.exports.github = async event => {
  const body = parseBody(event.body)

  const githubResponse = await fetch(GITHUB_URL)
    console.log(`github response: ${githubResponse}`)
  const githubJSON = await githubResponse.json()
    console.log(`github JSON: ${githubJSON}`)

  const issuesArray = githubJSON.reduce(
    (accumulator, issue) => {
      const issueURL = 'https://' + issue.url.slice(12, 23) + issue.url.slice(29)

      accumulator.push(
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `#${issue.number} - <${issueURL}|*${issue.title}*>`
          }
        },
        {
          type: "section",
          fields: issue.labels.map(label => {
            return {
              type: "plain_text",
              text: label.name
            }
          })
        },
        {
          type: "divider"
        }
      )
      return accumulator
    }, []
  )

  console.log(`issues array after reduce: ${(groupIssuesIntoMessages(issuesArray, 45))}`)

  return { //example
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(
      {
        message: "Go Serverless v1.0! Your function executed successfully!",
        input: event
      },
      null,
      2
    )
  };
};
