<template lang="html">
  <div class="donate">
    <h1>Support SourceBin by donating!</h1>

    <p>
      SourceBin is completely free to use. However, it costs money to keep SourceBin
      running and to improve it. Your support allows SourceBin to stay online and keeps
      development going. You can support using the following methods:
    </p>

    <div>
      <ul class="donations">
        <li>
          <a
            href="https://paypal.me/sourcebin"
            target="_blank"
            rel="noopener"
          >
            <font-awesome-icon :icon="['fab', 'paypal']" />

            PayPal
          </a>
        </li>

        <li v-for="(crypto, short) in cryptos">
          <a :href="`#${short}`">
            <img
              :src="crypto.img"
              :alt="`${crypto.name} Icon`"
            >

            {{ short }}
          </a>
        </li>
      </ul>

      <div
        v-if="type && cryptos[type]"
        class="details"
      >
        {{ cryptos[type].name }} Address: <br>
        <a :href="`${cryptos[type].urlPrefix}${cryptos[type].addr}`">{{ cryptos[type].addr }}</a>
      </div>
    </div>
  </div>
</template>

<script>
import { cryptos } from '@/assets/donate/cryptos.js';

export default {
  data() {
    return {
      type: null,
      cryptos,
    };
  },
  mounted() {
    this.updateType();
    window.addEventListener('hashchange', this.updateType);
  },
  beforeDestroy() {
    window.removeEventListener('hashchange', this.updateType);
  },
  methods: {
    updateType() {
      this.type = window.location.hash.slice(1);
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'sass-mq';
@import '@/assets/styles/_variables.scss';

$font-size-header: 48px;
$font-size-header-small: 40px;

.donate {
  font-family: var(--font-family);
  margin: 100px 0;
  padding: 0 var(--margin-side);
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1 {
  margin: 0;
  text-align: center;
  font-size: $font-size-header;
  font-weight: 700;
  color: var(--text-900);

  @include mq($until: tablet) {
    font-size: $font-size-header-small;
  }
}

p {
  color: var(--text-800);
  font-size: var(--font-size-big);
  max-width: 600px;
  text-align: center;
  margin: 50px 0;
}

.details {
  text-align: center;
  padding: 30px;
  color: var(--text-900);
  font-size: var(--font-size-big);
  font-weight: 700;

  a {
    color: $red;
    text-decoration: none;
    word-break: break-word;
  }
}

.donations {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  li {
    color: var(--text-900);
    font-size: var(--font-size-big);

    a,
    img,
    svg {
      display: inline-block;
      vertical-align: middle;
    }

    a {
      margin: 20px;
      color: inherit;
      text-decoration: none;

      &:hover {
        color: $red;
      }
    }

    img,
    svg {
      width: 40px;
      height: 40px;
      margin-right: 5px;
    }
  }
}
</style>
