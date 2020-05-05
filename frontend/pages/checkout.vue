<template lang="html">
  <div class="checkout">
    <div class="details">
      <h1>{{ plan.nickname }}</h1>
      <p>${{ plan.amount / 100 }} / {{ plan.interval | capitalize }}</p>
    </div>

    <div class="payment-method">
      <div ref="paymentRequest" />

      <p>{{ `${displayPaymentRequest ? 'or ' : ''}enter your card` | capitalize }}</p>

      <div
        ref="card"
        class="MyCardElement"
      />

      <h1>{{ error }}</h1>
    </div>

    <button @click="purchase">
      Purchase
    </button>
  </div>
</template>

<script>
export default {
  filters: {
    capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
  },
  middleware: 'authenticated',
  data() {
    return {
      error: '',
      cardElement: undefined,
      displayPaymentRequest: false,
    };
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
      country: 'NL',
      currency: 'usd',
      total: {
        label: this.plan.nickname,
        amount: this.plan.amount,
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
        this.error = error.message;
      } else {
        this.error = '';
      }
    });
  },
  methods: {
    async purchase() {
      const result = await this.$stripe.createPaymentMethod({
        type: 'card',
        card: this.cardElement,
      });

      if (result.error) {
        this.error = result.error;
        return;
      }

      await this.purchaseSubscription(result.paymentMethod);
    },
    async purchaseSubscription(paymentMethod) {
      let subscription;

      try {
        subscription = await this.$axios.$post('/api/billing/subscribe', {
          plan: this.plan.id,
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
