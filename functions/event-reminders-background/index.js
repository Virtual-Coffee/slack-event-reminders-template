require('dotenv').config();
const { WebClient } = require('@slack/web-api');
const { DateTime } = require('luxon');
const slackify = require('slackify-html');

// our fake events function - replace this with yours!
const { getEvents } = require('../../util/getEvents');

const SLACK_ANNOUNCEMENTS_CHANNEL = process.env.SLACK_ANNOUNCEMENTS_CHANNEL;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

const reminderTypes = ['weekly', 'daily', 'hourly'];

const handler = async function (event, context) {
  // types = weekly, daily, hourly

  try {
    const reminderType = event.queryStringParameters.type;

    if (reminderTypes.indexOf(reminderType) === -1) {
      throw new Error('Invalid reminder type');
    }

    if (!SLACK_BOT_TOKEN) {
      throw new Error('Missing Slack Bot Token');
    }

    if (!SLACK_ANNOUNCEMENTS_CHANNEL) {
      throw new Error('Missing Slack Announcements Channel');
    }

    const web = new WebClient(SLACK_BOT_TOKEN);

    // replace this with your own events data!
    const eventsList = await getEvents(reminderType);

    // this code expects an array of events that look like this:
    // {
    //   title: 'Event Title',
    //   startTime: today.toISOString(), // date in ISO format
    //   description: 'Description of event. HTML is allowed.',
    //   link: 'https://virtualcoffee.io/events', // url or string like "at the docs"
    // }
    // however, you can customize it any way you like - there's nothing that says it needs to look
    // or act the same as this!
    if (eventsList && eventsList.length) {
      switch (reminderType) {
        case 'weekly':
          const weeklyMessage = {
            channel: SLACK_ANNOUNCEMENTS_CHANNEL,
            unfurl_links: false,
            unfurl_media: false,
            // plain text version of the post. Read by screen readers, and used in notifications
            text: `This weeks events are: ${eventsList
              .map((event) => {
                return `${event.title}: ${DateTime.fromISO(
                  event.startTime
                ).toFormat('EEEE, fff')}`;
              })
              .join(', ')}`,
            blocks: [
              {
                type: 'header',
                text: {
                  type: 'plain_text',
                  text: "📆 This Week's Events Are:",
                  emoji: true,
                },
              },
              // loop through events and create a block for each one
              ...eventsList.map((event) => {
                const eventDate = DateTime.fromISO(event.startTime);
                // TODO - colate these by date
                return {
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text: `*<!date^${eventDate.toSeconds()}^{date_long_pretty} {time}|${eventDate.toFormat(
                      'EEEE, fff'
                    )}>*\n${event.title}`,
                  },
                };
              }),
              {
                type: 'context',
                elements: [
                  {
                    type: 'mrkdwn',
                    text: `See details and more events at <https://virtualcoffee.io/events|VirtualCoffee.IO>!`,
                  },
                ],
              },
            ],
          };

          // post to slack
          await web.chat.web.chat.postMessage(weeklyMessage);

          break;

        case 'daily':
          const dayCheck = new Date();
          if (dayCheck.getDay() === 1) {
            // don't run this one on monday, since the weekly one runs on monday
            return;
          }

          const dailyMessage = {
            channel: SLACK_ANNOUNCEMENTS_CHANNEL,
            unfurl_links: false,
            unfurl_media: false,
            // plain text version of the post. Read by screen readers, and used in notifications
            text: `Today's events are: ${eventsList
              .map((event) => {
                return `${event.title}: ${DateTime.fromISO(
                  event.startTime
                ).toFormat('EEEE, fff')}`;
              })
              .join(', ')}`,
            blocks: [
              {
                type: 'header',
                text: {
                  type: 'plain_text',
                  text: "📆 Today's Events Are:",
                  emoji: true,
                },
              },
              // loop through events and create blocks. We're using Array.reduce instead of map because we need to add
              // two items to the blocks array for each event (section and context)
              ...eventsList.reduce((list, event) => {
                const eventDate = DateTime.fromISO(event.startTime);
                return [
                  ...list,
                  {
                    type: 'section',
                    text: {
                      type: 'mrkdwn',
                      text: `*${
                        event.title
                      }*\n<!date^${eventDate.toSeconds()}^{date_long_pretty} {time}|${eventDate.toFormat(
                        'EEEE, fff'
                      )}>`,
                    },
                  },
                  {
                    type: 'context',
                    elements: [
                      {
                        type: 'mrkdwn',
                        text: slackify(event.description),
                      },
                    ],
                  },
                  {
                    type: 'divider',
                  },
                ];
              }, []),
            ],
          };

          await web.chat.postMessage(dailyMessage);

          break;

        case 'hourly':
          // filter out past events
          const now = DateTime.now();
          const filteredList = eventsList.filter((event) => {
            return now < DateTime.fromISO(event.startTime);
          });

          if (filteredList.length) {
            const hourlyMessage = {
              channel: SLACK_ANNOUNCEMENTS_CHANNEL,
              unfurl_links: false,
              unfurl_media: false,
              // plain text version of the post. Read by screen readers, and used in notifications
              text: `Starting soon: ${filteredList
                .map((event) => {
                  return `${event.title}: ${DateTime.fromISO(
                    event.startTime
                  ).toFormat('EEEE, fff')}`;
                })
                .join(', ')}`,
              blocks: [
                {
                  type: 'header',
                  text: {
                    type: 'plain_text',
                    text: '⏰ Starting Soon:',
                    emoji: true,
                  },
                },
                ...filteredList.reduce((list, event) => {
                  const eventDate = DateTime.fromISO(event.startTime);

                  const titleBlock = {
                    type: 'section',
                    text: {
                      type: 'mrkdwn',
                      text: `*${
                        event.title
                      }*\n<!date^${eventDate.toSeconds()}^{date_long_pretty} {time}|${eventDate.toFormat(
                        'EEEE, fff'
                      )}>`,
                    },
                  };

                  if (event.link && event.link.substring(0, 4) === 'http') {
                    // add a text link to message (no interactivity endpoint required)
                    // titleBlock.text.text = `${titleBlock.text.text}\n\n*<${event.link}|Join Here!>*`

                    // add a button link (looks nicer but requires interactivity endpoint to be set):
                    titleBlock.accessory = {
                      type: 'button',
                      text: {
                        type: 'plain_text',
                        text: 'Join Event',
                        emoji: true,
                      },
                      value: `join_event_${event.id}`,
                      url: event.link,
                      action_id: 'button-join-event',
                    };
                  }

                  return [
                    ...list,
                    titleBlock,
                    // if someone enters text like "At the clubhouse" for the event link, we can just add it as a string:
                    ...(event.link && event.link.substring(0, 4) !== 'http'
                      ? [
                          {
                            type: 'section',
                            text: {
                              type: 'mrkdwn',
                              text: `*Location:* ${event.link}`,
                            },
                          },
                        ]
                      : []),
                    {
                      type: 'context',
                      elements: [
                        {
                          type: 'mrkdwn',
                          text: slackify(event.description),
                        },
                      ],
                    },
                    {
                      type: 'divider',
                    },
                  ];
                }, []),
              ],
            };

            await web.chat.postMessage(hourlyMessage);
          }
          break;

        default:
          break;
      }
    }
  } catch (e) {
    console.error(e);
    return [];
  }
};

module.exports = { handler };
