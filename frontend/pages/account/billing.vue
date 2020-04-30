<template lang="html">
  <div class="billing">
    <h1>Add payment method</h1>

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
  mounted() {
    this.cardElement = this.$stripe.elements().create('card', {
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

      const paymentMethod = await this.$axios.$post('/api/billing/payment-method', {
        paymentMethod: result.paymentMethod.id,
      });

      console.log(paymentMethod);
    },
  },
};
</script>

<style lang="scss" scoped>
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
