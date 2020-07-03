import Vue from 'vue';

Vue.filter('capitalize', s => s.charAt(0).toUpperCase() + s.slice(1));

Vue.filter('currency', c => `$${(c / 100).toFixed(2)}`);

Vue.filter('pluralize', (s, n) => (n === 1 ? s : `${s}s`));

Vue.filter('date', (d) => {
  if (!d) {
    return 'Today';
  }

  const date = d instanceof Date ? d : new Date(d);

  if (date.toDateString() === new Date().toDateString()) {
    return 'Today';
  }

  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
});
