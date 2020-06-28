<template lang="html">
  <div class="carbonads">
    <AdBlock v-if="blocked" />

    <div
      ref="carbon"
      v-else
      class="ad"
    />
  </div>
</template>

<script>
import AdBlock from './AdBlock.vue';

export default {
  components: {
    AdBlock,
  },
  data() {
    return {
      blocked: false,
    };
  },
  mounted() {
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', '//cdn.carbonads.com/carbon.js?serve=CE7IP2JN&placement=sourcebin');
    script.setAttribute('id', '_carbonads_js');

    script.addEventListener('error', () => {
      this.blocked = true;
    });

    this.$refs.carbon.appendChild(script);
  },
};
</script>

<style lang="scss" scoped>
@import 'sass-mq';

$font-size-text: 13px;
$font-size-poweredby: 9px;

.carbonads {
  @include mq($from: desktop) {
    width: 330px;
    margin-left: var(--margin-between);
  }

  @include mq($until: desktop) {
    margin-top: var(--margin-between);
  }
}

.ad {
  display: flex;
  justify-content: center;
  height: 100px;
  max-width: 330px;

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
      font-weight: 700;
      font-size: $font-size-poweredby;
    }
  }
}
</style>
