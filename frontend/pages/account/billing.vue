<template lang="html">
  <div class="billing">
    <div class="subscription">
      <h1>Your Subscription</h1>

      <div v-if="subscription">
        <p>{{ subscription.plan.nickname }}</p>

        <button
          v-if="!subscription.cancel_at"
          @click="$refs.confirmCancel.open()"
        >
          Cancel
        </button>

        <button
          v-else
          @click="reenableSubscription()"
          class="reenable"
        >
          Re-enable subscription
        </button>
      </div>

      <div v-else>
        <p>You have no subscription</p>

        <nuxt-link to="/pricing">
          Get a subscription
        </nuxt-link>
      </div>
    </div>

    <div
      v-if="subscription"
      class="payment"
    >
      <div class="information">
        <h1>Billing Information</h1>

        <div v-if="upcomingInvoice">
          <p>
            Your subscription will automatically renew on
            <strong>{{ upcomingInvoice.period_end * 1000 | date }}</strong> and you'll be
            charged <strong>{{ upcomingInvoice.total | currency }}</strong>.
          </p>

          <p v-if="discount">
            The coupon <strong>{{ discount.coupon.id }}</strong> is applied to all your payments
            <span v-if="discount.end">till <strong>{{ discount.end * 1000 | date }}</strong></span>
            giving you a <strong>{{ amountOff }}</strong> discount.
          </p>
        </div>

        <p v-else-if="subscription.cancel_at">
          Your subscription is active till
          <strong>{{ subscription.cancel_at * 1000 | date }}</strong> and will not automatically
          renew.
        </p>
      </div>

      <div class="method">
        <h1>Billing Method</h1>

        <p>
          <span class="card-icon"><font-awesome-icon :icon="creditCardIcon" /></span>
          <span>•••• {{ paymentMethod.card.last4 }}</span>
          <span>
            {{ paymentMethod.card.exp_month.toString().padStart(2, '0') }}
            /
            {{ paymentMethod.card.exp_year }}
          </span>
        </p>
      </div>
    </div>

    <Confirm
      ref="confirmCancel"
      @confirm="cancelSubscription"
      title="Cancel Subscription"
      description="
        Are you sure you want to cancel your subscription?
        You can re-enable it again later.
      "
    />
  </div>
</template>

<script>
import Confirm from '@/components/overlay/Confirm.vue';

async function fetchBilling($axios) {
  const customer = await $axios.$get('/api/billing/customer');
  const upcomingInvoice = await $axios.$get('/api/billing/upcoming-invoice').catch(() => undefined);

  return {
    customer,
    upcomingInvoice,
  };
}

export default {
  components: {
    Confirm,
  },
  data() {
    return {
      confirmOverlay: true,
    };
  },
  computed: {
    subscription() {
      return this.customer.subscriptions.data[0];
    },
    paymentMethod() {
      if (!this.subscription) {
        return undefined;
      }

      return this.subscription.default_payment_method;
    },
    creditCardIcon() {
      if (!this.paymentMethod) {
        return undefined;
      }

      switch (this.paymentMethod.card.brand) {
        case 'amex':
          return ['fab', 'cc-amex'];
        case 'diners':
          return ['fab', 'cc-diners-club'];
        case 'discover':
          return ['fab', 'cc-discover'];
        case 'jcb':
          return ['fab', 'cc-jcb'];
        case 'mastercard':
          return ['fab', 'cc-mastercard'];
        case 'visa':
          return ['fab', 'cc-visa'];
        case 'unionpay':
        default:
          return ['fas', 'credit-card'];
      }
    },
    discount() {
      if (!this.upcomingInvoice) {
        return undefined;
      }

      return this.upcomingInvoice.discount;
    },
    amountOff() {
      if (!this.discount) {
        return undefined;
      }

      if (this.discount.coupon.amount_off) {
        return this.$options.filters.currency(this.discount.coupon.amount_off);
      }

      return `${this.discount.coupon.percent_off}%`;
    },
  },
  asyncData({ $axios }) {
    return fetchBilling($axios);
  },
  methods: {
    async updateBilling() {
      const { customer, upcomingInvoice } = await fetchBilling(this.$axios);

      this.customer = customer;
      this.upcomingInvoice = upcomingInvoice;
    },
    async cancelSubscription() {
      await this.$axios.$delete('/api/billing/cancel');
      await this.updateBilling();
    },
    async reenableSubscription() {
      await this.$axios.$post('/api/billing/reenable');
      await this.updateBilling();
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'sass-mq';
@import '@/assets/styles/_variables.scss';

$border-radius: 5px;

.billing {
  margin: 0 var(--margin-side);
  padding-bottom: 15px;
  font-family: var(--font-family);
}

.subscription {
  margin-bottom: var(--margin-between);
  padding: 20px 30px;
  background-color: var(--background-secondary);
  border-radius: $border-radius;

  h1 {
    margin: 0;
    padding-bottom: 15px;
    font-size: var(--font-size-header);
    color: var(--text-900);
  }

  p {
    margin: 0;
    padding-bottom: 15px;
    font-size: var(--font-size-big);
    color: var(--text-800);
  }

  button {
    border-radius: $border-radius;
    background-color: inherit;
    border: 1px solid var(--background-modifier-accent);
    font-size: var(--font-size-big);
    color: var(--text-700);
    padding: 10px 15px;
    cursor: pointer;
    outline: none;

    &:focus {
      color: var(--text-800);
    }

    &:hover {
      background-color: var(--background-modifier-hover);
    }

    &.reenable {
      background-color: $red;
      color: $white-800;

      &:hover {
        background-color: $red-modifier-hover;
      }
    }
  }

  a {
    display: inline-block;
    background-color: $red;
    color: $white-800;
    font-size: var(--font-size-big);
    text-decoration: none;
    border-radius: $border-radius;
    padding: 10px 15px;
  }
}

.payment {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 15px;

  @include mq($until: tablet) {
    grid-template-columns: 1fr;
  }

  > div {
    padding: 20px 30px;
    background-color: var(--background-secondary);
    border-radius: $border-radius;

    h1 {
      margin: 0 0 var(--margin-between);
      font-size: var(--font-size-big);
      color: var(--text-900);
    }

    p {
      margin: 0;
      font-size: var(--font-size-regular);
      color: var(--text-800);
    }

    &.method span {
      margin-right: var(--margin-between);
      vertical-align: middle;

      &.card-icon {
        font-size: var(--font-size-large);
      }
    }
  }
}
</style>
