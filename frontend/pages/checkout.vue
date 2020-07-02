<template lang="html">
  <div class="checkout">
    <div class="details">
      <h1>Purchase Details</h1>

      <div class="about">
        <p>{{ plan.nickname }}</p>
        <p>{{ plan.amount | currency }} / {{ plan.interval | capitalize }}</p>
      </div>

      <div class="coupon">
        <div>
          <font-awesome-icon :icon="['fas', 'ticket-alt']" />

          <input
            ref="coupon"
            @input="updateCoupon"

            placeholder="Coupon"
            type="text"
            spellcheck="false"
            autocapitalize="off"
            autocorrect="off"
          >
        </div>

        <p
          v-if="errors.coupon"
          class="coupon-error"
        >
          {{ errors.coupon }}
        </p>
        <p
          v-else-if="amountOff && couponDuration"
          class="coupon-info"
        >
          {{ amountOff }} {{ couponDuration }}
        </p>
      </div>

      <div class="total">
        <p>Today's Total</p>
        <p>{{ total | currency }}</p>
      </div>
    </div>

    <div class="payment-method">
      <h1>Enter your card</h1>

      <div
        ref="card"
        class="stripe-card"
      />

      <p
        v-if="errors.card"
        class="card-error"
      >
        {{ errors.card }}
      </p>

      <p class="legal">
        You'll be charged today, and every following {{ plan.interval }}
        while your subscription is active. You can cancel at any time.
      </p>

      <button
        @click="purchase"
        :disabled="loading || !complete || errors.card || errors.coupon"
      >
        {{ loading ? 'Processing...' : 'Purchase' }}
      </button>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash-es';

export default {
  middleware: 'auth',
  data() {
    return {
      errors: {
        card: undefined,
        coupon: undefined,
      },
      coupon: undefined,
      loading: false,
      complete: false,
      cardElement: undefined,
    };
  },
  computed: {
    total() {
      let amount;

      if (!this.coupon) {
        amount = this.plan.amount;
      } else if (this.coupon.amount_off) {
        amount = this.plan.amount - this.coupon.amount_off;
      } else if (this.coupon.percent_off) {
        amount = this.plan.amount * (1 - this.coupon.percent_off / 100);
      }

      return Math.floor(amount);
    },
    couponDuration() {
      if (!this.coupon) {
        return undefined;
      }

      if (this.coupon.duration === 'repeating') {
        const duration = this.coupon.duration_in_months;

        return `for ${duration} month${duration === 1 ? '' : 's'}`;
      }

      return this.coupon.duration;
    },
    amountOff() {
      if (!this.coupon) {
        return undefined;
      }

      if (this.coupon.amount_off) {
        return `- ${this.$options.filters.currency(this.coupon.amount_off)}`;
      }

      return `- ${this.coupon.percent_off}%`;
    },
  },
  async asyncData({ $axios, query, redirect }) {
    if (!query.plan) {
      redirect('/pro');
      return {};
    }

    try {
      const plan = await $axios.$get(`/api/billing/plan/${query.plan}`);

      return {
        plan,
      };
    } catch {
      redirect('/pro');
      return {};
    }
  },
  mounted() {
    const elements = this.$stripe.elements();

    this.cardElement = elements.create('card', {
      style: {
        base: {
          color: '#f2f2f2',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '16px',

          '::placeholder': {
            color: '#c0c0c0',
          },
        },
        invalid: {
          color: '#ff4747',
          iconColor: '#ff4747',
        },
      },
    });

    this.cardElement.mount(this.$refs.card);

    this.cardElement.addEventListener('change', ({ error, complete }) => {
      this.complete = complete;

      if (error) {
        this.errors.card = error.message;
      } else {
        this.errors.card = undefined;
      }
    });

    if (this.$route.query.coupon) {
      this.$refs.coupon.value = this.$route.query.coupon;
      this.updateCoupon();
    }
  },
  methods: {
    updateCoupon: debounce(async function () {
      const code = this.$refs.coupon.value.toUpperCase();

      if (!code) {
        this.coupon = undefined;
        this.errors.coupon = undefined;
        return;
      }

      try {
        const coupon = await this.$axios.$get(`/api/billing/coupon/${code}`);

        if (coupon.valid) {
          this.coupon = coupon;
          this.errors.coupon = undefined;
        } else {
          this.coupon = undefined;
          this.errors.coupon = `The coupon ${coupon.id} is expired`;
        }
      } catch (err) {
        this.coupon = undefined;
        this.errors.coupon = err.response.data.message;
      }
    }, 250),
    async purchase() {
      this.loading = true;

      const result = await this.$stripe.createPaymentMethod({
        type: 'card',
        card: this.cardElement,
      });

      if (result.error) {
        this.$toast.global.error(result.error.message);
        this.loading = false;
        return;
      }

      try {
        await this.purchaseSubscription(result.paymentMethod);

        this.$toast.global.success('Payment successful');
        this.$router.push('/account/billing');
      } catch (err) {
        this.$toast.global.error(err.message);
      }

      this.loading = false;
    },
    async purchaseSubscription(paymentMethod) {
      let subscription;

      try {
        subscription = await this.$axios.$post('/api/billing/subscribe', {
          plan: this.plan.id,
          coupon: this.coupon
            ? this.coupon.id
            : undefined,
          paymentMethod: paymentMethod.id,
        });
      } catch (err) {
        throw new Error(err.response.data.message);
      }

      const paymentIntent = subscription.latest_invoice.payment_intent;

      if (paymentIntent) {
        if (paymentIntent.status !== 'requires_action') {
          return subscription;
        }

        const result = await this.$stripe.confirmCardPayment(paymentIntent.client_secret);

        if (result.error) {
          throw new Error(result.error.message);
        }
      }

      return subscription;
    },
  },
  head() {
    return {
      title: 'Checkout',
    };
  },
};
</script>

<style lang="scss" scoped>
@import 'sass-mq';
@import '@/assets/styles/_variables.scss';

$border-radius: 5px;

.checkout {
  margin: 0 var(--margin-side);
  font-family: var(--font-family);
}

.details {
  margin-bottom: var(--margin-between);
  background-color: var(--background-secondary);
  padding: var(--margin-side);
  border-radius: $border-radius;

  h1 {
    margin: 0;
    font-size: var(--font-size-header);
    color: var(--text-800);
  }

  p {
    margin: 0;
  }

  .about,
  .coupon,
  .total {
    margin: var(--margin-between) 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: var(--font-size-big);
    color: var(--text-900);

    p {
      height: 100%;
    }
  }

  .coupon {
    @include mq($until: tablet) {
      flex-direction: column;
      align-items: flex-start;

      .coupon-info,
      .coupon-error {
        margin-top: var(--margin-between);
      }
    }

    input {
      margin-left: 5px;
      padding: 5px;
      background: var(--background-tertiary);
      color: var(--text-900);
      text-transform: uppercase;
      outline: none;
      border: 1px solid var(--background-modifier-accent);
      border-radius: 3px;
    }

    .coupon-error {
      color: $red;
    }
  }

  .total {
    margin-bottom: 0;
    padding-top: var(--margin-between);
    border-top: 1px solid var(--background-modifier-accent);
  }
}

.payment-method {
  background-color: var(--background-secondary);
  padding: var(--margin-side);
  border-radius: $border-radius;

  h1 {
    margin: 0 0 var(--margin-between);
    font-size: var(--font-size-large);
    color: var(--text-800);
  }

  /deep/ .stripe-card {
    height: 40px;
    padding: 10px 12px;
    color: var(--text-900);
    background-color: var(--background-tertiary);
    border: 1px solid var(--background-modifier-accent);
    border-radius: $border-radius;
  }

  .card-error {
    margin: var(--margin-between) 0 0;
    font-size: var(--font-size-big);
    color: $red;
  }

  .legal {
    margin: var(--margin-between) 0 0;
    font-size: var(--font-size-small);
    color: var(--text-600);
  }

  button {
    margin-top: var(--margin-between);
    padding: 10px 15px;
    outline: none;
    border: none;
    border-radius: $border-radius;
    background-color: $red;
    font-weight: 700;
    font-size: var(--font-size-big);
    color: $white-900;
    cursor: pointer;

    &[disabled] {
      opacity: 0.4;
      cursor: default;
    }

    &:not([disabled]):hover {
      background-color: $red-modifier-hover;
    }
  }
}
</style>
