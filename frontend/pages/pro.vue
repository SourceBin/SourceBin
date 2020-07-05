<template lang="html">
  <div class="pro">
    <div class="header">
      <h1>Upgrade to Pro to unlock awesome features</h1>

      <p v-if="coupon && coupon.metadata.description">
        {{ coupon.metadata.description }}
      </p>
    </div>

    <div class="links">
      <nuxt-link :to="checkout('pro_monthly')">
        $1.99 / Month
      </nuxt-link>

      <nuxt-link :to="checkout('pro_yearly')">
        $19.99 / Year <span>(2 months free)</span>
      </nuxt-link>
    </div>

    <div class="perks">
      <div>
        <font-awesome-icon
          :icon="['fas', 'star']"
          class="ad-free"
        />
        <h1>100% Ad Free</h1>
        <p>Remove all ads from SourceBin.</p>
      </div>

      <div>
        <font-awesome-icon
          :icon="['fas', 'layer-group']"
          class="multibins"
        />
        <h1>Multibins</h1>
        <p>Save multiple files in a single bin.</p>
      </div>

      <div>
        <font-awesome-icon
          :icon="['fas', 'align-left']"
          class="code-formatting"
        />
        <h1>Code Formatting</h1>
        <p>Format JavaScript, HTML, CSS, Markdown, and other languages in SourceBin.</p>
      </div>

      <div>
        <font-awesome-icon
          :icon="['fas', 'cloud-upload-alt']"
          class="upload-limit"
        />
        <h1>Upgraded Upload Limit</h1>
        <p>Increase your upload limit from 0.1MB to 5MB.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ $axios, query, redirect }) {
    if (!query.coupon) {
      return { coupon: undefined };
    }

    try {
      const coupon = await $axios.$get(`/api/billing/coupon/${query.coupon.toUpperCase()}`);

      return {
        coupon,
      };
    } catch {
      redirect('/pro');
      return {};
    }
  },
  methods: {
    checkout(plan) {
      const { coupon } = this.$route.query;
      return `/checkout?plan=${plan}${coupon ? `&coupon=${coupon}` : ''}`;
    },
  },
  head() {
    let description = 'Upgrade to Pro to unlock awesome features!';

    if (this.coupon) {
      description += ` ${this.coupon.metadata.description}`;
    }

    return {
      title: 'Pro',
      meta: [
        { name: 'description', hid: 'description', content: description },

        { name: 'og:description', hid: 'og:description', content: description },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
@import 'sass-mq';
@import '@/assets/styles/_variables.scss';

$color-ad-free: #ffad4d;
$color-multibins: #70d18c;
$color-code-formatting: #63c7ff;
$color-upload-limit: #fa63ff;

$font-size-header: 48px;
$font-size-header-small: 40px;

$font-size-icon: 40px;
$font-size-icon-small: 30px;

.pro {
  padding: 0 var(--margin-side);
  font-family: var(--font-family);
}

.header {
  margin: 100px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  @include mq($until: tablet) {
    margin: 50px 0;
  }

  h1 {
    margin: 0;
    font-size: $font-size-header;
    font-weight: 700;
    color: var(--text-900);
    max-width: 800px;

    @include mq($until: tablet) {
      font-size: $font-size-header-small;
    }
  }

  p {
    margin: 30px 0 0;
    font-size: var(--font-size-large);
    color: var(--text-900);
  }
}

.links {
  display: flex;
  justify-content: center;

  @include mq($until: tablet) {
    flex-direction: column;
  }

  a {
    margin: var(--margin-between);
    padding: 15px 20px;
    color: $white-900;
    font-size: var(--font-size-big);
    background-color: $red;
    text-decoration: none;
    text-align: center;
    border-radius: 3px;

    &:hover {
      background-color: $red-modifier-hover;
    }

    span {
      color: $white-800;
      font-size: var(--font-size-small);
      vertical-align: middle;
    }
  }
}

.perks {
  margin: 100px auto;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 1000px;
  text-align: center;

  @include mq($until: tablet) {
    margin: 50px auto;
  }

  div {
    padding: 30px;
    width: percentage(1 / 3);

    @include mq($until: desktop) {
      width: percentage(1 / 2);
    }

    @include mq($until: tablet) {
      padding: 15px;
      width: 100%;
    }

    svg {
      font-size: $font-size-icon;

      @include mq($until: tablet) {
        font-size: $font-size-icon-small;
      }

      &.ad-free {
        color: $color-ad-free;
      }

      &.multibins {
        color: $color-multibins;
      }

      &.code-formatting {
        color: $color-code-formatting;
      }

      &.upload-limit {
        color: $color-upload-limit;
      }
    }
  }

  h1 {
    color: var(--text-900);
    font-size: var(--font-size-large);
  }

  p {
    color: var(--text-800);
    font-size: var(--font-size-big);
  }
}
</style>
