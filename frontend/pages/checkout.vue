<template lang="html">
  <div class="checkout">
    <div class="details">
      <h1>{{ plan.nickname }}</h1>
      <p>${{ plan.amount / 100 }} / {{ plan.interval | capitalize }}</p>
    </div>

    <div class="payment-method">
      <h1>Pay with</h1>

      <select
        ref="paymentMethod"
        v-if="paymentMethods"
      >
        <option
          v-for="paymentMethod in paymentMethods.data"
        >
          {{ paymentMethod.card.last4 }}
        </option>
      </select>
    </div>

    <button @click="purchase">
      Get {{ plan.nickname }}
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
  data() {
    return {
      paymentMethods: undefined,
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
  async beforeMount() {
    this.paymentMethods = await this.$axios.$get('/api/billing/payment-methods');
  },
  methods: {
    async purchase() {
      const paymentMethod = this.paymentMethods.data[this.$refs.paymentMethod.selectedIndex];

      const subscription = await this.$axios.$post('/api/billing/subscribe', {
        plan: this.plan.id,
        paymentMethod: paymentMethod.id,
      });

      const { payment_intent: paymentIntent } = subscription.latest_invoice;

      if (paymentIntent) {
        if (paymentIntent.status === 'requires_action') {
          const result = this.$stripe.confirmCardPayment(paymentIntent.client_secret);

          if (result.error) {
            alert(result.error.message);
          } else {
            alert('Successful confirmation');
          }
        } else {
          alert('Successful payment');
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/* stylelint-disable */

.checkout {
  color: white;
}
</style>
