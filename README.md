# Slack Event Reminders Template

How to use this template:

- Click the "Use this template" button above
- Customize the [`getEvents`](./util/getEvents.js) function to get your events
- Customize the output in the [event reminders function](./functions/event-reminders-background/index.js)
- Connect your site to Netlify
- Once your site is up on Netlify, follow these steps to create a Slack app:

  - Go to the [new Slack App page](https://api.slack.com/apps?new_app=1)
  - Select "From an app manifest"
  - Copy the following code, replace `your-netlify-site.netlify.app` with your site url, and paste it in:

  ```yaml
  display_information:
    name: Event Reminders App
    description: Event Reminders for All!
    background_color: '#c55100'
  features:
    bot_user:
      display_name: Event Reminders App
      always_online: true
  oauth_config:
    scopes:
      bot:
        - chat:write
        - chat:write.public
  settings:
    interactivity:
      is_enabled: true
      request_url: https://your-netlify-site.netlify.app/slack-interactivity
    org_deploy_enabled: false
    socket_mode_enabled: false
    token_rotation_enabled: false
  ```

- After the App is created, go to **OAuth & Permissions**, and in the **OAuth Tokens for Your Workspace** section, and install it to your workspace. Once it's installed, in the same section you'll have a **Bot User OAuth Token** that we'll need for posting messages.
- In Slack, go to the channel you'd like to post to, click on the title to open up the channel information, and scroll all the way to the bottom to get your **Channel ID**
- In the Netlify admin, go to Settings -> Build and Deploy -> Environment, and add the following environment variables:
  - `SLACK_BOT_TOKEN` - the **Bot User OAuth Token** value
  - `SLACK_ANNOUNCEMENTS_CHANNEL` - the **Channel ID**
