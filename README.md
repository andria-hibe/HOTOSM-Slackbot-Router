# HOTOSM-Slackbot-Router
Contribution to Outreachy Project for Humanitarian OpenStreetMap - Build a Slackbot Router

### Commands:
- `/tm-good-first-issue` - returns issues in the Tasking Manager GitHub repo with the ‘Difficulty: Easy’ label
- `/tm-stats (project ID)` - returns stats about the specified HOT project on Tasking Manager
- `/tm-health` - returns the current status of the Tasking Manager
---
## Setup
1. After cloning this repo:
   ```
   cd HOTOSM-Slackbot-Router && npm i
   ```
2. Connect your AWS credentials by following the instructions [HERE](https://serverless.com/framework/docs/providers/aws/guide/credentials/
).
3. Deploy the service:
    ```
    npm run deploy
    ```
4. In your console, copy the returned `ServiceEndpoint` URL. This will be the endpoint URL used in your Slack app.

## Create a Slack App
1. Create your Slack app by going to the [Slack API website](https://api.slack.com/) and clicking 'Start Building'.
2. Name your app and choose the desired Slack Workspace you want to use your app in.
3. Under **Features**, choose **Slash Commands** and click **Create New Command**.
4. Fill out the details. Under the *Request URL* field, paste the `ServiceEndpoint` URL you copied earlier. Save your changes.
5. Make sure the app is installed in your workspace (under Basic Information, **Add features and functionality* and *Install your app to your workspace** should have a checkmark.
6. Head to your chosen Slack workspace and try out your new command.

## Demo
You can join a workspace that already has a Slack App with the Slack Commands installed using [this link](https://join.slack.com/t/andriasworkspace/shared_invite/zt-cyo248fa-bnUfvNRp6oZCOelOa1Vpkw).
---
### Resources:
- [Serverless (AWS Provider) Docs](https://serverless.com/framework/docs/providers/aws/)
- [Slack API Docs](https://api.slack.com/#read_the_docs)
- [GitHub API Docs](https://developer.github.com/v3/)
- [Tasking Manager API Docs](https://tasks.hotosm.org/api-docs)
- [OSMCha API Docs](https://osmcha.org/api-docs/)

