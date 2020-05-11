import Vue from 'vue';

Vue.filter('capitalize', s => s.charAt(0).toUpperCase() + s.slice(1));
Vue.filter('currency', c => `$${(c / 100).toFixed(2)}`);
Vue.filter('date', d => (d instanceof Date ? d : new Date(d)).toLocaleString(undefined, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
}));
