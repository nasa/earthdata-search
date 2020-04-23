export const granuleData = [
  {
    id: 'one',
    browseFlag: true,
    onlineAccessFlag: true,
    dayNightFlag: 'DAY',
    formattedTemporal: [
      '2019-04-28 00:00:00',
      '2019-04-29 23:59:59'
    ],
    thumbnail: '/fake/path/image.jpg',
    title: 'Granule title one',
    links: [
      {
        rel: 'http://linkrel/data#',
        title: 'linktitle',
        href: 'http://linkhref'
      }
    ],
    handleMouseEnter: jest.fn()
  },
  {
    id: 'two',
    browseFlag: true,
    onlineAccessFlag: true,
    dayNightFlag: 'DAY',
    formattedTemporal: [
      '2019-04-28 00:00:00',
      '2019-04-29 23:59:59'
    ],
    thumbnail: '/fake/path/image.jpg',
    title: 'Granule title two',
    links: [
      {
        rel: 'http://linkrel/data#',
        title: 'linktitle',
        href: 'http://linkhref'
      }
    ],
    handleMouseEnter: jest.fn()
  }
]
