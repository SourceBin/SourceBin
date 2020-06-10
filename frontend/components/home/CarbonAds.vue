<template lang="html">
  <div
    ref="carbon"
    class="ad"
  />
</template>

<script>
export default {
  mounted() {
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', '//cdn.carbonads.com/carbon.js?serve=CE7IP2JN&placement=sourcebin');
    script.setAttribute('id', '_carbonads_js');
    this.$refs.carbon.appendChild(script);
  },
};
</script>

<style lang="scss" scoped>
@import 'sass-mq';

$font-size-text: 13px;
$font-size-poweredby: 9px;

.ad {
  display: flex;
  justify-content: center;
  height: 100px;
  max-width: 330px;

  @include mq($from: desktop) {
    margin-left: var(--margin-between);
  }

  @include mq($until: desktop) {
    margin-top: var(--margin-between);
  }

  /deep/ #carbonads {
    display: flex;
    position: relative;
    background-color: var(--background-secondary);
    font-family: var(--font-family);
    color: var(--text-700);

    a {
      color: inherit;
      text-decoration: none;
    }

    .carbon-wrap {
      display: flex;
    }

    .carbon-img img {
      display: block;
    }

    .carbon-text {
      margin-bottom: 10px;
      font-size: $font-size-text;
      padding: 7px;
      line-height: 1.5;
    }

    .carbon-poweredby {
      position: absolute;
      bottom: 5px;
      right: 5px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
      font-size: $font-size-poweredby;
    }
  }
}
</style>
