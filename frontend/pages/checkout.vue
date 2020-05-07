<template lang="html">
  <div class="checkout">
    <div class="details">
      <h1>{{ plan.nickname }}</h1>
      <p>{{ plan.amount | currency }} / {{ plan.interval | capitalize }}</p>

      <div>
        <input
          ref="coupon"
          @input="updateCoupon"
        >

        <p v-if="errors.coupon">
          {{ errors.coupon }}
        </p>
        <p v-else-if="couponDuration">
          This coupon applies {{ couponDuration }}
        </p>
      </div>

      <p>Total: {{ total | currency }}</p>
    </div>

    <div class="payment-method">
      <div ref="paymentRequest" />

      <p>{{ `${displayPaymentRequest ? 'or ' : ''}enter your card` | capitalize }}</p>

      <div
        ref="card"
        class="MyCardElement"
      />

      <h1>{{ errors.card }}</h1>
    </div>

    <button @click="purchase">
      Purchase
    </button>
  </div>
</template>

<script>
import { debounce } from 'lodash-es';

export default {
  filters: {
    capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    currency(value) {
      return `$${value / 100}`;
    },
  },
  middleware: 'authenticated',
  data() {
    return {
      errors: {
        coupon: '',
        card: '',
      },
      coupon: undefined,
      cardElement: undefined,
      displayPaymentRequest: false,
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
  },
  async asyncData({ $axios, query, redirect }) {
    if (!query.plan) {
      redirect('/pricing');
      return {};
    }

    try {
      const plan = await $axios.$get(`/api/billing/plan/${query.plan}`);

      return {
        plan,
      };
    } catch {
      redirect('/pricing');
      return {};
    }
  },
  async mounted() {
    const elements = this.$stripe.elements();

    const paymentRequest = this.$stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: this.plan.nickname,
        amount: this.total,
      },
      requestPayerName: true,
    });

    const prButton = elements.create('paymentRequestButton', { paymentRequest });

    this.displayPaymentRequest = await paymentRequest.canMakePayment();
    if (this.displayPaymentRequest) {
      prButton.mount(this.$refs.paymentRequest);
    } else {
      this.$refs.paymentRequest.style.display = 'none';
    }

    paymentRequest.on('paymentmethod', async (event) => {
      const result = await this.purchaseSubscription(event.paymentMethod);

      if (result.error) {
        event.complete('fail');
        return;
      }

      event.complete('success');
    });

    this.cardElement = elements.create('card', {
      style: {
        base: {
          color: '#32325d',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '16px',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a',
        },
      },
    });

    this.cardElement.mount(this.$refs.card);

    this.cardElement.addEventListener('change', ({ error }) => {
      if (error) {
        this.errors.card = error.message;
      } else {
        this.errors.card = '';
      }
    });
  },
  methods: {
    updateCoupon: debounce(async function () {
      try {
        const coupon = await this.$axios.$get(`/api/billing/coupon/${this.$refs.coupon.value}`);

        if (coupon.valid) {
          this.coupon = coupon;
          this.errors.coupon = '';
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
      const result = await this.$stripe.createPaymentMethod({
        type: 'card',
        card: this.cardElement,
      });

      if (result.error) {
        this.errors.card = result.error;
        return;
      }

      await this.purchaseSubscription(result.paymentMethod);
    },
    async purchaseSubscription(paymentMethod) {
      let subscription;

      try {
        subscription = await this.$axios.$post('/api/billing/subscribe', {
          plan: this.plan.id,
          coupon: this.coupon.id,
          paymentMethod: paymentMethod.id,
        });
      } catch (err) {
        return { error: err.response.data.message };
      }

      const paymentIntent = subscription.latest_invoice.payment_intent;

      if (paymentIntent) {
        if (paymentIntent.status !== 'requires_action') {
          return subscription;
        }

        const result = await this.$stripe.confirmCardPayment(paymentIntent.client_secret);

        if (result.error) {
          return { error: result.error.messag };
        }
      }

      return { subscription };
    },
  },
};
</script>

<style lang="scss" scoped>
/* stylelint-disable */

.checkout {
  color: white;
}

.MyCardElement {
  height: 40px;
  padding: 10px 12px;
  width: 100%;
  color: #32325d;
  background-color: white;
  border: 1px solid transparent;
  border-radius: 4px;

  box-shadow: 0 1px 3px 0 #e6ebf1;
  -webkit-transition: box-shadow 150ms ease;
  transition: box-shadow 150ms ease;
}

.MyCardElement--focus {
  box-shadow: 0 1px 3px 0 #cfd7df;
}

.MyCardElement--invalid {
  border-color: #fa755a;
}

.MyCardElement--webkit-autofill {
  background-color: #fefde5 !important;
}
</style>
