import Vue from 'vue';

import Selector from '@/components/selector/Selector.vue';

const SelectorClass = Vue.extend(Selector);

export default (_, inject) => {
  inject('createSelector', (propsData) => {
    const instance = new SelectorClass({ propsData });

    instance.$mount();
    document.body.appendChild(instance.$el);

    return instance;
  });
};
