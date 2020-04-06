"use strict"

const fetch = require('node-fetch')

const TM_URL = 'https://tasks.hotosm.org/api/health-check'

const slackBlock = (status) => {
  if (status === 'healthy') {
    return {
			type: "section",
			text: {
				type: "mrkdwn",
				text: ":white_check_mark: The Tasking Manager is currently operational"
			}
		}
  } else {
    return {
			type: "section",
			text: {
				type: "mrkdwn",
				text: ":heavy_exclamation_mark: The Tasking Manager cannot be reached right now"
			}
		}
  }
}

module.exports.healthCheck = async event => {
  const taskingManagerResponse = await fetch(TM_URL)
  const responseJSON = await taskingManagerResponse.json()
  const status = responseJSON.status

  const slackMessage = {
    blocks: [
      slackBlock(status)
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