<template lang="html">
  <div ref="carbon">
    <div id="carbon-text" />
  </div>
</template>

<script>
export default {
  mounted() {
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', '//m.servedby-buysellads.com/monetization.js');

    script.addEventListener('load', () => {
      this.loaded();
    });

    this.$refs.carbon.appendChild(script);
  },
  methods: {
    loaded() {
      const bsa = window._bsa; // eslint-disable-line no-underscore-dangle

      if (typeof bsa === 'undefined') {
        console.warn('Failed to load Carbon Ads Text');
        return;
      }

      bsa.init('custom', 'CEBIP53W', 'placement:sourcebin', {
        target: '#carbon-text', template: `
<a class="native-box" href="##statlink##">
  <img src="##image##" style="background-color: ##backgroundColor##" class="native-img">
  <div class="native-text"><strong>##company##</strong> — ##description##</div>
</a>
        `,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'sass-mq';

#carbon-text /deep/ {
  max-width: 640px;
  border-radius: 3px;
  background-color: var(--background-secondary);

  .native-box {
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 10px 15px;
  }

  .native-img {
    box-sizing: content-box;
    margin: 0;
    padding: 5px;
    width: 25px;
    border-radius: 50%;
  }

  .native-text {
    font-family: var(--font-family);
    color: var(--text-700);
    font-size: var(--font-size-regular);
    padding-left: 15px;
    line-height: 1.35;
  }
}
</style>
