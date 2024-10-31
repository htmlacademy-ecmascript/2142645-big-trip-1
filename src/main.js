import { RenderPosition, render } from './render.js';
import TripInfoView from './view/trip-info-view.js';
import FilterView from './view/filters-view.js';
import EventsPresenter from './presenter/events-presenter.js';
import EventsModel from './model/events-model.js';

const tripMain = document.querySelector('.trip-main');
const tripControlsFilters = document.querySelector('.trip-controls__filters');
const eventsSection = document.querySelector('.trip-events');

const eventsModel = new EventsModel();
const eventsPresenter = new EventsPresenter({ eventsContainer: eventsSection, eventsModel });

render(new TripInfoView(), tripMain, RenderPosition.AFTERBEGIN);
render(new FilterView(), tripControlsFilters);

eventsPresenter.init();
