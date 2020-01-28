import Vue from 'vue';

export default (_, inject) => {
  inject('eventBus', new Vue());
};
