"use strict"

module.exports.events = async event => {
  const challenge = JSON.parse(event.body.challenge)

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/plain'
    },
    body: challenge
  }
}