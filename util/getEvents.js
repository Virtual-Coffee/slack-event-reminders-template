async function getEvents(type) {
  const today = new Date();
  today.setHours(today.getHours() + 0.5);

  switch (type) {
    case 'hourly':
      return [
        {
          title: 'Test Event 1',
          startTime: today.toISOString(),
          description:
            'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin augue nisi, fermentum vitae, imperdiet a, auctor eu, mi. Nulla imperdiet molestie purus. Duis arcu dui, pretium in, molestie id, convallis eget, orci. Praesent eget purus.',
          link: 'https://virtualcoffee.io/events',
        },
      ];
    case 'daily':
      const today2 = new Date();
      today2.setHours(today2.getHours() + 2);

      return [
        {
          title: 'Test Event 1',
          startTime: today.toISOString(),
          description:
            'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin augue nisi, fermentum vitae, imperdiet a, auctor eu, mi. Nulla imperdiet molestie purus. Duis arcu dui, pretium in, molestie id, convallis eget, orci. Praesent eget purus.',
          link: 'https://virtualcoffee.io/events',
        },
        {
          title: 'Test Event 2',
          startTime: today2.toISOString(),
          description:
            'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin augue nisi, fermentum vitae, imperdiet a, auctor eu, mi. Nulla imperdiet molestie purus. Duis arcu dui, pretium in, molestie id, convallis eget, orci. Praesent eget purus.',
          link: 'https://virtualcoffee.io/events',
        },
      ];

    case 'weekly':
      const tomorrow = new Date();
      tomorrow.setHours(tomorrow.getHours() + 2);

      return [
        {
          title: 'Test Event 1',
          startTime: today.toISOString(),
          description:
            'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin augue nisi, fermentum vitae, imperdiet a, auctor eu, mi. Nulla imperdiet molestie purus. Duis arcu dui, pretium in, molestie id, convallis eget, orci. Praesent eget purus.',
          link: 'https://virtualcoffee.io/events',
        },
        {
          title: 'Test Event 2',
          startTime: tomorrow.toISOString(),
          description:
            'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin augue nisi, fermentum vitae, imperdiet a, auctor eu, mi. Nulla imperdiet molestie purus. Duis arcu dui, pretium in, molestie id, convallis eget, orci. Praesent eget purus.',
          link: 'https://virtualcoffee.io/events',
        },
      ];

    default:
      break;
  }
}

module.exports = { getEvents };
