<template lang="html">
  <div class="adblock">
    <p>
      Consider disabling your ad blocker or <nuxt-link to="/donate">
        donating
      </nuxt-link> to support SourceBin.
    </p>
  </div>
</template>

<style lang="scss" scoped>
@import 'sass-mq';
@import '@/assets/styles/_variables.scss';

.adblock {
  background-color: var(--background-secondary);
  font-family: var(--font-family);
  font-size: var(--font-size-regular);
  color: var(--text-600);
  border-radius: 3px;

  @include mq($until: tablet) {
    margin: 0 var(--margin-side);
  }

  p {
    margin: 0;
    padding: var(--margin-between);
    text-align: center;
  }

  a {
    color: $red;
    font-weight: 700;
    text-decoration: none;
  }
}
</style>
