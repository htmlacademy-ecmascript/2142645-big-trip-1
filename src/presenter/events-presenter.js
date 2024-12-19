import { remove, render } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import NoEventView from '../view/no-event-view.js';
import EventsLoadingView from '../view/events-loading-view.js';
import DownloadErrorView from '../view/download-error-view.js';
import NewEventButtonView from '../view/new-event-button-view.js';
import EventPresenter from './event-presenter.js';
import NewEventPresenter from './new-event-presenter.js';
import { SortType, UserAction, UpdateType, FilterType, TimeLimit } from '../const.js';
import { sortingByDay, sortingByTime, sortingByPrice } from '../util/task.js';
import { filter } from '../util/filter.js';

export default class EventsPresenter {
  #eventsListView = new EventsListView();
  #newEventButtonView = null;
  #noEventView = null;
  #sortView = null;
  #eventPresenter = null;
  #eventsContainer = null;
  #tripMainContainer = null;
  #eventsModel = null;
  #filterModel = null;
  #offersByIdData = null;
  #getDestinationsById = null;
  #eventPresenters = new Map();
  #currentSortType = SortType.DAY;
  #currentFilter = FilterType.EVERTHING;
  #newEventPresenter = null;
  #isEventsLoading = true;
  #eventsLoadingView = new EventsLoadingView();
  #downloadErrorView = new DownloadErrorView();
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({ eventsContainer, eventsModel, filterModel, tripMainContainer }) {
    this.#eventsContainer = eventsContainer;
    this.#tripMainContainer = tripMainContainer;
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;
    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#eventsModel.init()
      .then(() => {
        this.#handleNewEventClose();
      });

    this.#renderPageEvents();
    this.#newEventButtonView = new NewEventButtonView({ handleNewEventButtonClick: this.#handleNewEventButtonClick });
    render(this.#newEventButtonView, this.#tripMainContainer);
  }

  get points() {
    this.#currentFilter = this.#filterModel.filter;
    const filteredPoints = filter[this.#currentFilter](this.#eventsModel.points);
    switch (this.#currentSortType) {
      case SortType.TIME:
        return filteredPoints.sort(sortingByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortingByPrice);
    }
    return filteredPoints.sort(sortingByDay);
  }

  #resetViews = () => {
    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((eventPresenter) => eventPresenter.resetView());
  };

  #handleViewAction = async (userAction, updateType, updatePoint) => {
    this.#uiBlocker.block();

    switch (userAction) {
      case UserAction.UPDATE_EVENT:
        this.#eventPresenters.get(updatePoint.id).setSaving();
        try {
          await this.#eventsModel.updatePoint(updateType, updatePoint);
          this.#eventPresenters.get(updatePoint.id).changeFormToCard();
        } catch (err) {
          this.#eventPresenters.get(updatePoint.id).setAborting();
        }
        break;
      case UserAction.ADD_EVENT:
        this.#newEventPresenter.setSaving();
        try {
          await this.#eventsModel.addPoint(updateType, updatePoint);
          this.#newEventPresenter.destroy();
        } catch (err) {
          this.#newEventPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_EVENT:
        this.#eventPresenters.get(updatePoint.id).setDeleting();
        try {
          await this.#eventsModel.deletePoint(updateType, updatePoint);
        } catch (err) {
          this.#eventPresenters.get(updatePoint.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #rerenderPageEvents = (props) => {
    this.#clearEventsSection(props);
    this.#renderPageEvents();
  };

  #handleModelEvent = (updateType, updatePoint) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#eventPresenters.get(updatePoint.id).init({ point: updatePoint, offers: this.#offersByIdData, destinations: this.#getDestinationsById });
        break;
      case UpdateType.MINOR:
        this.#rerenderPageEvents();
        break;
      case UpdateType.MAJOR:
        this.#rerenderPageEvents({ resetSort: true });
        break;
      case UpdateType.INIT:
        this.#isEventsLoading = false;
        remove(this.#eventsLoadingView);
        this.#offersByIdData = structuredClone(this.#eventsModel.offersById);
        this.#getDestinationsById = structuredClone(this.#eventsModel.destinationsById);
        this.#initNewEventPresenter();
        this.#renderPageEvents();
        break;
      case UpdateType.ERROR:
        this.#isEventsLoading = false;
        remove(this.#eventsLoadingView);
        this.#renderDownloadError();
        break;
    }
  };

  #isRenderNoEventView = () => !this.points.length;


  #initNewEventPresenter() {
    this.#newEventPresenter = new NewEventPresenter({
      handleNewEventClose: this.#handleNewEventClose,
      handleViewAction: this.#handleViewAction,
      rerenderPageEvents: this.#rerenderPageEvents,
      isRerenderPageEvents: this.#isRenderNoEventView,
      offers: this.#offersByIdData,
      destinations: this.#getDestinationsById
    });
  }

  #renderSort() {
    this.#sortView = new SortView({ currentSortType: this.#currentSortType, onSortItemChange: this.#onSortItemChange });
    render(this.#sortView, this.#eventsContainer);
  }

  #onSortItemChange = (sortType) => {
    if (this.#currentSortType !== sortType) {
      this.#currentSortType = sortType;
      this.#rerenderPageEvents();
    }
  };

  #returnCurrentSortType = () => this.#currentSortType;

  #renderEvent(dataEvent) {
    this.#eventPresenter = new EventPresenter({
      onEventItemChange: this.#handleViewAction,
      eventsListElement: this.#eventsListView.element,
      resetViews: this.#resetViews,
      returnCurrentSortType: this.#returnCurrentSortType
    });
    this.#eventPresenter.init(dataEvent);
    this.#eventPresenters.set(dataEvent.point.id, this.#eventPresenter);
  }

  #clearEventsSection({ resetSort = false } = {}) {
    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((eventPresenter) => eventPresenter.destroy());
    this.#eventPresenters.clear();
    remove(this.#sortView);
    remove(this.#eventsListView);

    if (resetSort) {
      this.#currentSortType = SortType.DAY;
    }

    if (this.#noEventView) {
      remove(this.#noEventView);
    }
  }

  #renderEventsLoading() {
    render(this.#eventsLoadingView, this.#eventsContainer);
  }

  #renderDownloadError() {
    render(this.#downloadErrorView, this.#eventsContainer);
  }

  #renderEventsList() {
    render(this.#eventsListView, this.#eventsContainer);
    this.points.forEach((point) => {
      this.#renderEvent({ point, offers: this.#offersByIdData, destinations: this.#getDestinationsById });
    });
  }

  #renderNoEvent() {
    this.#noEventView = new NoEventView({ currentFilter: this.#currentFilter });
    render(this.#noEventView, this.#eventsContainer);
  }

  #renderPageEvents() {
    if (this.#isEventsLoading) {
      this.#renderEventsLoading();
      return;
    }

    if (this.#isRenderNoEventView()) {
      this.#renderNoEvent();
      return;
    }

    this.#renderSort();
    this.#renderEventsList();
  }

  #createEvent() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERTHING);

    if (this.#isRenderNoEventView()) {
      remove(this.#noEventView);
      render(this.#eventsListView, this.#eventsContainer);
    }

    this.#newEventPresenter.init({ eventsListElement: this.#eventsListView.element });
  }

  #handleNewEventButtonClick = () => {
    this.#newEventButtonView.element.disabled = true;
    this.#createEvent();
  };

  #handleNewEventClose = () => {
    this.#newEventButtonView.element.disabled = false;
  };
}

