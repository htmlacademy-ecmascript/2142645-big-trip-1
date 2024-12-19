import TripInfoView from '../view//trip-info-view.js';
import { replace, render, remove, RenderPosition } from '../framework/render.js';
import { sortingByDay } from '../util/task.js';

export default class TripInfoPresenter {
  #tripInfoContainer = null;
  #eventsModel = null;
  #points = [];
  #offersById = [];
  #destinations = [];
  #tripInfoElement = null;

  constructor({ tripInfoContainer, eventsModel }) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#eventsModel = eventsModel;
    this.#eventsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#points = structuredClone(this.#eventsModel.points).sort(sortingByDay);
    this.#offersById = structuredClone(this.#eventsModel.offersById);
    this.#destinations = structuredClone(this.#eventsModel.destinationsById);
    if (!this.#points.length) {
      return;
    }

    const prevTripInfoElement = this.#tripInfoElement;

    this.#tripInfoElement = new TripInfoView({
      points: this.#points,
      offers: this.#offersById,
      destinations: this.#destinations
    });

    if (prevTripInfoElement === null) {
      return render(this.#tripInfoElement, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
    }

    replace(this.#tripInfoElement, prevTripInfoElement);
    remove(prevTripInfoElement);
  }

  #handleModelEvent = () => {
    this.init();
  };
}
