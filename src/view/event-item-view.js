import { createElement } from '../render.js';
import { formatsDate, calculatesDuration } from '../util.js';
import { DATE_FORMAT } from '../const.js';

function createEventsItemViewTemplate(event) {
  return (
    `<li class="trip-events__item">
       <div class="event">
         <time class="event__date" datetime="${formatsDate(event.DATE_FROM, DATE_FORMAT.YYYY_MM_DD)}">${formatsDate(event.DATE_FROM, DATE_FORMAT.МММ_DD)}</time>
         <div class="event__type">
           <img class="event__type-icon" width="42" height="42" src="img/icons/${event.TYPE}.png" alt="Event type icon">
         </div>
         <h3 class="event__title">${event.TYPE} ${event.DESTINATION.NAME}</h3>
         <div class="event__schedule">
           <p class="event__time">
             <time class="event__start-time" datetime="${formatsDate(event.DATE_FROM, DATE_FORMAT.YYYY_MM_DDTHH_MM)}">${formatsDate(event.DATE_FROM, DATE_FORMAT.HH_MM)}</time>
             &mdash;
             <time class="event__end-time" datetime="${formatsDate(event.DATE_TO, DATE_FORMAT.YYYY_MM_DDTHH_MM)}">${formatsDate(event.DATE_TO, DATE_FORMAT.HH_MM)}</time >
           </p >
    <p class="event__duration">${calculatesDuration(event.DATE_FROM, event.DATE_TO)}</p>
         </div >
         <p class="event__price">
           &euro;&nbsp;<span class="event__price-value">${event.BASE_PRICE}</span>
         </p>
         <h4 class="visually-hidden">Offers:</h4>
         <ul class="event__selected-offers">
    ${event.OFFERS.map((offer) =>
      `<li class="event__offer">
         <span class="event__offer-title">${offer.TITLE}</span>
         &plus;&euro;&nbsp;
         <span class="event__offer-price">${offer.PRICE}</span>
       </li>`
    ).join('')}
         </ul>
         <button class="event__favorite-btn ${event.IS_FAVORITE ? 'event__favorite-btn--active' : ''}" type="button">
           <span class="visually-hidden">Add to favorite</span>
           <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
             <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
           </svg>
         </button>
         <button class="event__rollup-btn" type="button">
           <span class="visually-hidden">Open event</span>
         </button>
       </div >
     </li > `
  );
}

export default class EventItemView {
  constructor({ event }) {
    this.event = event;
  }

  getTemplate() {
    return createEventsItemViewTemplate(this.event);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(createEventsItemViewTemplate(this.event));
    }

    return this.element;
  }

  removeElemnt() {
    this.element = null;
  }
}

