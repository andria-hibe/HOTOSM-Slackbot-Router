'use strict'

const fetch = require('node-fetch')
const { parseBody } = require('./utils')

const OSMCHA_REQUEST_HEADER = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Token b0f566a5e9113e293a8a2a753af74d59106b4517', //change this with parameter store value
  },
}

const createBlock = (
  projectId,
  projectInfo,
  changesetCount,
  changesetFlags,
  suspectChangesetCount
) => {
  const flagArray = changesetFlags.reduce((accumulator, flag) => {
    if (flag.changesets != 0) {
      accumulator.push({
        type: 'mrkdwn',
        text: `${flag.name}: ${flag.changesets} changesets`,
      })
    }
    return accumulator
  }, [])

  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `There are ${changesetCount} changesets for ${projectId} - ${projectInfo.name}.`,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${suspectChangesetCount} or ${
          (suspectChangesetCount / changesetCount) * 100
        }% of changesets have been flagged as suspicious. Here is the breakdown of flags:`,
      },
    },
    {
      type: 'section',
      fields: flagArray,
    },
  ]
}

module.exports.handler = async (event) => {
  const body = parseBody(event.body)
  const responseURL = decodeURIComponent(body.response_url)
  const projectID = body.text

  try {
    const taskingManagerURL = `https://tasking-manager-tm4-production-api.hotosm.org/api/v2/projects/${projectID}/?as_file=false&abbreviated=false`

    const taskingManagerProjectJSON = await fetch(taskingManagerURL)
    const taskingManagerProjectObj = await taskingManagerProjectJSON.json()
    const {
      projectInfo,
      aoiBBOX,
      changesetComment,
      created: dateCreated,
    } = taskingManagerProjectObj

    const osmChaSuspectURL =
      'https://osmcha.org/api/v1/changesets/suspect/?area_lt=2&date__gte=' +
      dateCreated.substring(0, 10) +
      '&comment=' +
      encodeURIComponent(changesetComment) +
      '&in_bbox=' +
      aoiBBOX.join()

    const osmChaSuspectJSON = await fetch(
      osmChaSuspectURL,
      OSMCHA_REQUEST_HEADER
    )
    const osmChaSuspectObj = await osmChaSuspectJSON.json()
    const { count: suspectChangesetCount } = osmChaSuspectObj

    const osmChaStatsURL =
      'https://osmcha.org/api/v1/stats/?area_lt=2&date__gte=' +
      dateCreated.substring(0, 10) +
      '&comment=' +
      encodeURIComponent(changesetComment) +
      '&in_bbox=' +
      aoiBBOX.join()

    const osmChaProjectStatsJSON = await fetch(
      osmChaStatsURL,
      OSMCHA_REQUEST_HEADER
    )
    const osmChaProjectStatsObj = await osmChaProjectStatsJSON.json()
    const { changesets, reasons } = osmChaProjectStatsObj

    const slackMessage = {
      response_type: 'ephemeral',
      blocks: createBlock(
        projectID,
        projectInfo,
        changesets,
        reasons,
        suspectChangesetCount
      ),
    }

    await fetch(responseURL, {
      method: 'post',
      body: JSON.stringify(slackMessage),
      headers: { 'Content-Type': 'application/json' },
    })

    return {
      statusCode: 200,
    }
  } catch (error) {
    console.error(error)

    await fetch(responseURL, {
      method: 'post',
      body: JSON.stringify('Something went wrong with your request'),
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
