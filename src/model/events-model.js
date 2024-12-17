import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';


export default class EventsModel extends Observable {
  #points = [];
  #destinations = [];
  #offers = [];
  #eventsApiService = null;

  constructor({ eventsApiService }) {
    super();
    this.#eventsApiService = eventsApiService;
  }

  async init() {
    try {
      const events = await this.#eventsApiService.events;
      this.#points = events.map(this.#adaptToClient);
      this.#destinations = await this.#eventsApiService.destinations;
      this.#offers = await this.#eventsApiService.offers;
    } catch (err) {
      this.#points = [];
    }
    this._notify(UpdateType.INIT);
  }

  get destinationsById() {
    return this.#destinations.reduce((destinationsById, destination) => {
      destinationsById[destination.id] = {
        id: destination.id,
        description: destination.description,
        name: destination.name,
        pictures: destination.pictures
      };

      return destinationsById;
    }, {});
  }

  get offersById() {
    return this.#offers.reduce((offersById, offersByType) => {
      offersByType.offers.forEach((offer) => {
        offersById[offer.id] = {
          id: offer.id,
          title: offer.title,
          price: offer.price,
          type: offersByType.type,
        };
      });

      return offersById;
    }, {});
  }

  get points() {
    return this.#points;
  }

  async updatePoint(updateType, update) {
    const updateIndex = this.points.findIndex((item) => item.id === update.id);

    if (updateIndex === -1) {
      throw new Error('Не удалось обновить не найденное событие');
    }

    try {
      const responseUpdateEvent = await this.#eventsApiService.updateEvent(update);
      const updateEvent = this.#adaptToClient(responseUpdateEvent);


      this.#points = [
        ...this.#points.slice(0, updateIndex),
        updateEvent,
        ...this.#points.slice(updateIndex + 1)
      ];

      this._notify(updateType, update);
    } catch {
      throw new Error('Не удалось обновить событие');
    }
  }

  addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const updateIndex = this.points.findIndex((item) => item.id === update.id);

    if (updateIndex === -1) {
      throw new Error('Не удалось удалить не найденное событие');
    }

    this.#points = [
      ...this.#points.slice(0, updateIndex),
      ...this.#points.slice(updateIndex + 1)
    ];

    this._notify(updateType);
  }

  #adaptToClient(event) {
    const adapterEvent = {
      ...event,
      basePrice: event['base_price'],
      dateFrom: event['date_from'],
      dateTo: event['date_to'],
      isFavorite: event['is_favorite'],
    };

    delete adapterEvent['base_price'];
    delete adapterEvent['date_from'];
    delete adapterEvent['date_to'];
    delete adapterEvent['is_favorite'];

    return adapterEvent;
  }
}
