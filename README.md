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
- After you've added the environment variables, you'll have to redeploy the site. Go to Deploys -> Trigger Deploy.

At this point, you can test your integration by going to `https://your-netlify-site.netlify.app/event-reminders?type=weekly`. If all is well, you should have a message in your Slack!

You can watch the log of your function on the netlify admin by going to Functions -> `event-reminders-background`. This will output messages if something is failing behind the scenes.

## Cron Job Schedule

Now we just need to set up a schedule for running these functions. At Virtual Coffee, we use [cron-job.org](https://cron-job.org), a free service for cron jobs. Here are our settings:

### Event reminders hourly

- URL: `https://your-netlify-site.netlify.app/event-reminders?type=hourly`
- Schedule: Every hour at 50 minutes past the hour
- Crontab: `50 * * * *`

### Event Reminders Daily

- URL: `https://your-netlify-site.netlify.app/event-reminders?type=daily`
- Schedule: Every day at 8am
- Crontab: `0 8 * * *`

### Event Reminders Weekly

- URL: `https://your-netlify-site.netlify.app/event-reminders?type=weekly`
- Schedule: Every Monday at 8am
- Crontab: `0 8 * * 1`

## Local development

You may find it easier to develop locally. This can be done using the Netlify CLI.

#### Installing the Netlify CLI

The [Netlify CLI](https://docs.netlify.com/cli/get-started) allows users to run a local version of the Netlify environment for local development. You can even [share your locally-running app with other people on the internet](https://docs.netlify.com/cli/get-started/#share-a-live-development-server)!!

To install:

```sh
npm i -g netlify-cli
```

If you have previously installed the Netlify CLI, you should update it to the latest version:

```sh
npm i -g netlify-cli@latest
```

#### Setting up your .env

Use the following command to create a local `.env` file.

```shell
cp .env-example .env
```

Then open the new file (`.env`) and update `SLACK_BOT_TOKEN` and `SLACK_ANNOUNCEMENTS_CHANNEL`.

#### Installing package dependencies

Once you have the Netlify CLI installed, you're ready to install the local dependencies! Run the following command:

```shell
yarn
```

At this point you're ready to roll! Run the following command to get rolling!

```sh
netlify dev
```

This will create a local server running at `http://localhost:8888/`. You can now visit your function directly (ie go to `http://localhost:8888/event-reminders?type=weekly`), and see output right in your terminal!
