import { getRandomItemArray } from '../util.js';

const Points = [
  {
    ID: 'f4b62099-293f-4c3d-a702-94eec4a2808c',
    BASE_PRICE: 1100,
    DATE_FROM: '2019-07-10T22:55:56.845Z',
    DATE_TO: '2019-07-11T11:22:13.375Z',
    DESTINATION: 'bfa5cb75-a1fe-4b77-a83c-0e528e910e04',
    IS_FAVORITE: false,
    OFFERS: [
      'b4c3e4e6-9053-42ce-b747-e281314baa31',
      'a3f1e4e8-99d2-44a3-bf47-c2e318baa123'
    ],
    TYPE: 'taxi'
  },
  {
    ID: 'bbd77e9c-8ef0-42d5-b0e3-36fa3de073df',
    BASE_PRICE: 1500,
    DATE_FROM: '2019-08-15T10:45:23.000Z',
    DATE_TO: '2019-08-15T13:30:00.000Z',
    DESTINATION: 'f7a5cb63-c1ee-4c32-9b7d-0f525e920e87',
    IS_FAVORITE: true,
    OFFERS: [
      'ab12c4e3-45f3-43cb-9a07-8d5b1d034aa1',
      'fd2e3b29-4879-4c12-98e2-4e5a61dbb6d3'
    ],
    TYPE: 'flight'
  },
  {
    ID: 'd9b4d6f3-8d91-49e1-81d3-a6d2ef42c57d',
    BASE_PRICE: 800,
    DATE_FROM: '2019-09-05T09:55:45.000Z',
    DATE_TO: '2019-09-05T10:00:00.000Z',
    DESTINATION: 'bf97cb75-b2ef-4d74-a83f-0e527b920e22',
    IS_FAVORITE: false,
    OFFERS: [
      '1ac3b3a5-90f2-4bc8-bb4f-2c13b9a4e5d2',
      'b1f3a2d7-12ab-4c9f-912a-9e57b3e1234f',
      '4f9e9f53-56fa-4c2c-b934-4eab917f38b7'
    ],
    TYPE: 'drive'
  },
  {
    ID: 'c1f8c9d4-478c-4d3e-b5ff-9e5b6e7c917f',
    BASE_PRICE: 600,
    DATE_FROM: '2019-10-01T14:22:00.000Z',
    DATE_TO: '2019-10-01T14:50:00.000Z',
    DESTINATION: 'e5d8a4b1-1d0b-4c4d-9f5c-3d273a5dfb6a',
    IS_FAVORITE: true,
    OFFERS: [
      'c1e4d6b7-5b7a-4e1c-a4a6-3f2818b3312c',
      'b5f1c3d6-7c8e-4b3b-b6ff-8d7c1f3d5a5e',
      'a4b7c6d8-92cf-4f5d-8f3b-6d12b7c7d222'
    ],
    TYPE: 'check-in'
  }
];

const Destinations = [
  {
    ID: 'bfa5cb75-a1fe-4b77-a83c-0e528e910e04',
    DESCRIPTION: 'Chamonix, is a beautiful city, a true Asian pearl, with crowded streets.',
    NAME: 'Chamonix',
    PICTURES: [
      {
        SRC: 'http://picsum.photos/300/200?r=0.0762563005163317',
        DESCRIPTION: 'Chamonix parliament building'
      }
    ]
  },
  {
    ID: 'f7a5cb63-c1ee-4c32-9b7d-0f525e920e87',
    DESCRIPTION: 'Paris, the city of lights and love, known for its historic landmarks and cafes.',
    NAME: 'Paris',
    PICTURES: [
      {
        SRC: 'http://picsum.photos/300/200?r=0.0762563005163317',
        DESCRIPTION: 'The Eiffel Tower in Paris'
      }
    ]
  },
  {
    ID: 'bf97cb75-b2ef-4d74-a83f-0e527b920e22',
    DESCRIPTION: 'Berlin, a vibrant city with rich history and modern culture.',
    NAME: 'Berlin',
    PICTURES: [
      {
        SRC: 'http://picsum.photos/300/200?r=0.0762563005163317',
        DESCRIPTION: 'Brandenburg Gate in Berlin'
      }
    ]
  },
  {
    ID: 'e5d8a4b1-1d0b-4c4d-9f5c-3d273a5dfb6a',
    DESCRIPTION: 'Tokyo, a city that combines futuristic technology with traditional temples.',
    NAME: 'Tokyo',
    PICTURES: [
      {
        SRC: 'http://picsum.photos/300/200?r=0.0762563005163317',
        DESCRIPTION: 'Tokyo Tower in the evening'
      }
    ]
  }
];

const Offers = [
  {
    TYPE: 'taxi',
    OFFERS: [
      {
        ID: 'b4c3e4e6-9053-42ce-b747-e281314baa31',
        TITLE: 'Up to a business',
        PRICE: 120
      },
      {
        ID: 'a3f1e4e8-99d2-44a3-bf47-c2e318baa123',
        TITLE: 'Choose the radio',
        PRICE: 10
      },
      {
        ID: 'd1e7c4b2-4d3f-423a-a347-e281afcb3321',
        TITLE: 'Drive with air',
        PRICE: 50
      }
    ]
  },
  {
    TYPE: 'check-in',
    OFFERS: [
      {
        ID: 'c1e4d6b7-5b7a-4e1c-a4a6-3f2818b3312c',
        TITLE: 'Priority check-in',
        PRICE: 30
      },
      {
        ID: 'b5f1c3d6-7c8e-4b3b-b6ff-8d7c1f3d5a5e',
        TITLE: 'welcome drink',
        PRICE: 15
      },
      {
        ID: 'a4b7c6d8-92cf-4f5d-8f3b-6d12b7c7d222',
        TITLE: 'Access to VIP',
        PRICE: 100
      }
    ]
  },
  {
    TYPE: 'drive',
    OFFERS: [
      {
        ID: '1ac3b3a5-90f2-4bc8-bb4f-2c13b9a4e5d2',
        TITLE: 'Add luggage',
        PRICE: 25
      },
      {
        ID: 'b1f3a2d7-12ab-4c9f-912a-9e57b3e1234f',
        TITLE: 'Ecenic route',
        PRICE: 40
      },
      {
        ID: '4f9e9f53-56fa-4c2c-b934-4eab917f38b7',
        TITLE: 'Extra driver',
        PRICE: 60
      },
      {
        ID: 'd8b5c2e1-14ac-4c8f-9b1e-a9e23f4b3d45',
        TITLE: 'Child seat',
        PRICE: 15
      }
    ]
  },
  {
    TYPE: 'flight',
    OFFERS: [
      {
        ID: 'ab12c4e3-45f3-43cb-9a07-8d5b1d034aa1',
        TITLE: 'Extra legroom',
        PRICE: 50
      },
      {
        ID: 'fd2e3b29-4879-4c12-98e2-4e5a61dbb6d3',
        TITLE: 'In-flight meal',
        PRICE: 20
      },
      {
        ID: 'f9d1c3a7-9a3b-4d7e-b4c5-f5e3d7a6b123',
        TITLE: 'Window seat',
        PRICE: 15
      },
      {
        ID: 'b5d3e4c6-8f4d-4c9e-a5d2-8f1e3a6b4d52',
        TITLE: 'Priority boarding',
        PRICE: 35
      },
      {
        ID: 'e7c8a3d2-5b3f-4a7e-9c2d-a1d8b5f9d9ab',
        TITLE: 'Track security',
        PRICE: 25
      }
    ]
  }
];

const getRandomEvent = () => {
  const event = getRandomItemArray(Points);

  event.OFFERS.forEach((offerId, indexOfferId) => {
    for (const offers of Offers) {
      const foundOffer = offers.OFFERS.find((offer) => offer.ID === offerId);
      if (foundOffer) {
        event.OFFERS[indexOfferId] = foundOffer;
        break;
      }
    }
  });

  for (const destination of Destinations) {
    if (destination.ID === event.DESTINATION) {
      event.DESTINATION = destination;
      break;
    }
  }

  return event;
};

export { getRandomEvent };
