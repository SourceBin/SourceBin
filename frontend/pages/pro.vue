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
        <h1>100% Ad Free</h1>
        <p>Turn off ads on all of SourceBin.</p>
      </div>

      <div>
        <h1>Code Formatting</h1>
        <p>Format code directly in SourceBin.</p>
      </div>

      <div>
        <h1>Upgraded Upload Limit</h1>
        <p>Increased upload limit from 0.1MB to 5MB.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ $axios, query, redirect }) {
    if (!query.coupon) {
      return {};
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
};
</script>

<style lang="scss" scoped>
@import 'sass-mq';
@import '@/assets/styles/_variables.scss';

$font-size-header: 48px;
$font-size-header-small: 40px;

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
  flex-wrap: wrap;
  max-width: 1000px;

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
