<template lang="html">
  <div class="billing">
    <h1>Add payment method</h1>

    <div ref="paymentRequest" />

    <form @submit.prevent="addCard">
      <div
        ref="card"
        class="MyCardElement"
      />

      <h1 role="alert">
        {{ cardError }}
      </h1>

      <button type="submit">
        Add card
      </button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cardError: '',
      cardElement: undefined,
    };
  },
  async mounted() {
    const elements = this.$stripe.elements();

    const paymentRequest = this.$stripe.paymentRequest({
      country: 'NL',
      currency: 'usd',
      total: {
        label: 'Add Payment',
        amount: 0,
      },
      requestPayerName: true,
    });

    const prButton = elements.create('paymentRequestButton', { paymentRequest });

    const result = await paymentRequest.canMakePayment();
    if (result) {
      prButton.mount(this.$refs.paymentRequest);
    } else {
      this.$refs.paymentRequest.style.display = 'none';
    }

    paymentRequest.on('paymentmethod', async (event) => {
      const paymentMethod = await this.addPaymentMethod(event.paymentMethod.id);

      if (paymentMethod) {
        event.complete('success');
      } else {
        event.complete('fail');
      }
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
        this.cardError = error.message;
      } else {
        this.cardError = '';
      }
    });
  },
  methods: {
    async addCard() {
      const result = await this.$stripe.createPaymentMethod({
        type: 'card',
        card: this.cardElement,
      });

      const paymentMethod = await this.addPaymentMethod(result.paymentMethod.id);

      console.log(paymentMethod);
    },
    async addPaymentMethod(id) {
      const paymentMethod = await this.$axios.$post('/api/billing/payment-method', {
        paymentMethod: id,
      });

      return paymentMethod;
    },
  },
};
</script>

<style lang="scss" scoped>
/* stylelint-disable */

.billing {
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
