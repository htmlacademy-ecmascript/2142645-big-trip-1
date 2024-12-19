import { render, replace, remove } from '../framework/render.js';
import EventItemView from '../view/event-item-view.js';
import EventEditView from '../view/event-edit-view.js';
import { Mode, UserAction, UpdateType, SortType } from '../const.js';

export default class EventPresenter {
  #eventEdit = null;
  #eventItem = null;
  #eventsListElement = null;
  #onEventItemChange = null;
  #resetViews = null;
  #dataEvent = null;
  #eventMode = Mode.VIEW;
  #returnCurrentSortType = null;

  constructor({ onEventItemChange, eventsListElement, resetViews, returnCurrentSortType }) {
    this.#eventsListElement = eventsListElement;
    this.#onEventItemChange = onEventItemChange;
    this.#resetViews = resetViews;
    this.#returnCurrentSortType = returnCurrentSortType;
  }

  init(dataEvent) {
    this.#dataEvent = dataEvent;

    const prevEventEdit = this.#eventEdit;
    const prevEventItem = this.#eventItem;

    this.#eventEdit = new EventEditView({
      ...this.#dataEvent,
      onEventEditFormSubmit: this.#onEventEditFormSubmit,
      closeEditForm: this.#closeEditForm,
      handleDeleteEvent: this.#handleDeleteEvent
    });

    this.#eventItem = new EventItemView({
      ...this.#dataEvent,
      onRollupClick: this.#onRollupClick,
      onEventFavoriteBtnClick: this.#onEventFavoriteBtnClick
    });

    if (prevEventEdit === null && prevEventItem === null) {
      return render(this.#eventItem, this.#eventsListElement);
    }

    if (this.#eventMode === Mode.EDIT) {
      replace(this.#eventEdit, prevEventEdit);
    }

    if (this.#eventMode === Mode.VIEW) {
      replace(this.#eventItem, prevEventItem);
    }

    remove(prevEventEdit);
    remove(prevEventItem);
  }

  destroy() {
    remove(this.#eventEdit);
    remove(this.#eventItem);
  }

  resetView() {
    if (this.#eventMode !== Mode.VIEW) {
      this.#eventEdit.resetEventEditView();
      this.changeFormToCard();
    }
  }

  changeFormToCard() {
    if (this.#eventMode === Mode.EDIT) {
      replace(this.#eventItem, this.#eventEdit);
      this.#eventMode = Mode.VIEW;
      window.removeEventListener('keydown', this.#onEventEditEscape);
    }
  }

  #onEventEditFormSubmit = (updatePoint) => {
    const { point } = this.#dataEvent;
    const currentSortType = this.#returnCurrentSortType();
    let isMinorUpdate = false;
    switch (currentSortType) {
      case SortType.DAY:
        isMinorUpdate = point.dateFrom !== updatePoint.dateFrom;
        break;
      case SortType.TIME:
        isMinorUpdate = point.dateFrom !== updatePoint.dateFrom || point.dateTo !== updatePoint.dateTo;
        break;
      case SortType.PRICE:
        isMinorUpdate = point.basePrice !== updatePoint.basePrice;
        break;
    }
    this.#onEventItemChange(UserAction.UPDATE_EVENT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      updatePoint);
  };

  #onRollupClick = () => {
    this.#resetViews();
    replace(this.#eventEdit, this.#eventItem);
    this.#eventMode = Mode.EDIT;
    window.addEventListener('keydown', this.#onEventEditEscape);
  };

  #onEventEditEscape = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#closeEditForm();
    }
  };

  #closeEditForm = () => {
    this.#eventEdit.resetEventEditView();
    this.changeFormToCard();
  };

  #handleDeleteEvent = (updatePoint) => {
    this.#onEventItemChange(
      UserAction.DELETE_EVENT,
      UpdateType.MINOR,
      updatePoint
    );
  };

  #onEventFavoriteBtnClick = () => this.#onEventItemChange(
    UserAction.UPDATE_EVENT,
    UpdateType.PATCH,
    { ...this.#dataEvent.point, isFavorite: !this.#dataEvent.point.isFavorite }
  );

  setSaving() {
    if (this.#eventMode === Mode.EDIT) {
      this.#eventEdit.updateElement({
        isDisable: true,
        isSaiving: true,
        isDeleting: false,
      });
    }
  }

  setDeleting() {
    if (this.#eventMode === Mode.EDIT) {
      this.#eventEdit.updateElement({
        isDisable: true,
        isSaiving: false,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#eventMode === Mode.VIEW) {
      this.#eventEdit.shake();
      return;
    }
    const resetCardForm = () => {
      this.#eventEdit.updateElement({
        isDisable: false,
        isSaiving: false,
        isDeleting: false,
      });
    };

    this.#eventEdit.shake(resetCardForm);
  }
}
