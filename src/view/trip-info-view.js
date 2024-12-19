import AbstractView from '../framework/view/abstract-view.js';
import { formatsDate } from '../util/task.js';
import { DateFormat } from '../const.js';

const createTripInfoTitleTemplate = (points, destinations) => {
  let textDestinotions;
  const DestinationsName = points.map((point) => `${destinations[point.destination].name}`);
  const uniqueDestinationsName = new Set(DestinationsName);
  const uniqueDestinationsNameArray = Array.from(uniqueDestinationsName);
  if (uniqueDestinationsNameArray.length <= 3) {
    textDestinotions = uniqueDestinationsNameArray.join(' &mdash; ');
  } else {
    textDestinotions = `${destinations[points[0].destination].name} &mdash;...&mdash; ${destinations[points.at(-1).destination].name}`;
  }
  return `<h1 class="trip-info__title">${textDestinotions}</h1>`;
};

const tripTotalPrice = (points, offers) => {
  const pointsTotalPrice = points.reduce((totalPricePoints, point) => totalPricePoints + point.basePrice, 0);
  const offetsTotalPrice = points.reduce((totalOffersPrice, point) => totalOffersPrice + point.offers.reduce((offersPrice, offerId) => offersPrice + offers[offerId].price, 0), 0);
  const totalPrice = pointsTotalPrice + offetsTotalPrice;
  return totalPrice;
};

const createTripInfoTemplate = ({ points, offers, destinations }) =>
  `<section class="trip-main__trip-info  trip-info">
     <div class="trip-info__main">
     ${createTripInfoTitleTemplate(points, destinations)}
       <p class="trip-info__dates">${formatsDate(points[0].dateFrom, DateFormat.SHORT_DATE)}&nbsp;&mdash;&nbsp;${formatsDate(points.at(-1).dateTo, DateFormat.SHORT_DATE)}</p>
     </div>
     <p class="trip-info__cost">
       Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripTotalPrice(points, offers)}</span>
     </p>
   </section>`;

export default class TripInfoView extends AbstractView {
  #points = null;
  #offers = null;
  #destinations = null;

  constructor({ points, offers, destinations }) {
    super();
    this.#points = points;
    this.#offers = offers;
    this.#destinations = destinations;
  }

  get template() {
    return createTripInfoTemplate({ points: this.#points, offers: this.#offers, destinations: this.#destinations });
  }
}
