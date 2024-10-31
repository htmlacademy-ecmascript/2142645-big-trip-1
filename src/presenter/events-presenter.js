import { render } from '../render.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import EventItemView from '../view/event-item-view.js';
import EventEditView from '../view/event-edit-view.js';
import CreatingEventView from '../view/creating-event-view.js';

export default class EventsPresenter {
  eventsListView = new EventsListView();

  constructor({ eventsContainer, eventsModel }) {
    this.eventsContainer = eventsContainer;
    this.eventsModel = eventsModel;
  }

  init() {
    this.eventsData = [...this.eventsModel.getEvents()];

    render(new SortView(), this.eventsContainer);
    render(this.eventsListView, this.eventsContainer);
    render(new CreatingEventView(), this.eventsListView.getElement());
    render(new EventEditView({ event: this.eventsData[0] }), this.eventsListView.getElement());

    for (let i = 1; i < this.eventsData.length; i++) {
      render(new EventItemView({ event: this.eventsData[i] }), this.eventsListView.getElement());
    }
  }
}
