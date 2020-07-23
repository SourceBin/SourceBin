<template lang="html">
  <div class="account">
    <div class="about">
      <img
        :src="`/proxy/?q=${encodeURIComponent(auth.user.about.avatarURL)}`"
        alt="avatar"
        class="avatar"
      >

      <div class="info">
        <p class="username">
          {{ auth.user.username }}

          <span
            v-if="$store.getters.pro"
            class="pro"
          >PRO</span>
        </p>

        <div class="stats">
          <div>
            <font-awesome-icon :icon="['fas', 'calendar-day']" />
            {{ auth.user.createdAt | date }}
          </div>

          <div>
            <font-awesome-icon :icon="['fas', 'file']" />
            {{ bins.length }}
          </div>
        </div>
      </div>
    </div>

    <div class="bins">
      <BinCard
        v-for="(bin, i) in sortedBins"
        :key="i"
        :bin="bin"

        @disown="disownBin(bin)"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Mousetrap from 'mousetrap';

import BinCard from '@/components/BinCard.vue';

export default {
  components: {
    BinCard,
  },
  middleware: 'auth',
  computed: {
    sortedBins() {
      return [...this.bins]
        .sort((a, b) => new Date(b.created) - new Date(a.created));
    },
    ...mapState(['auth']),
  },
  async asyncData({ $axios }) {
    const bins = await $axios.$get('/api/user/bins');

    return {
      bins,
    };
  },
  mounted() {
    Mousetrap.bind('esc', () => this.$router.push('/'));
  },
  beforeDestroy() {
    Mousetrap.unbind('esc');
  },
  methods: {
    async disownBin(bin) {
      await this.$axios.$delete(`/api/bins/${bin.key}`);

      this.bins = this.bins.filter(b => b.key !== bin.key);
    },
  },
  head() {
    return {
      title: 'Account',
    };
  },
};
</script>

<style lang="scss" scoped>
@import 'sass-mq';
@import '@/assets/styles/_variables.scss';

$border-radius: 5px;

.account {
  margin: 0 var(--margin-side);
  padding-bottom: 15px;
  font-family: var(--font-family);
}

.about {
  display: flex;
  width: 100%;
  margin-bottom: var(--margin-between);
  padding: 20px 0;
  background-color: var(--background-secondary);
  border-radius: $border-radius;

  @include mq($until: tablet) {
    flex-direction: column;
    align-items: center;
  }

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin: 0 var(--margin-side);

    @include mq($until: tablet) {
      margin-bottom: var(--margin-between);
    }
  }

  .info {
    display: flex;
    flex-direction: column;
    justify-content: center;

    .username {
      margin: 0 0 var(--margin-between);
      font-size: var(--font-size-header);
      color: var(--text-900);

      @include mq($until: tablet) {
        padding: 0 var(--margin-side);
      }

      .pro {
        vertical-align: middle;
        padding: 2px 4px;
        font-size: var(--font-size-regular);
        font-weight: 700;
        color: $white-900;
        background-color: $red;
        border-radius: 3px;
      }
    }

    .stats {
      display: inline-flex;
      color: var(--text-700);

      @include mq($until: tablet) {
        justify-content: center;
      }

      div {
        margin-right: var(--margin-between);

        &:last-child {
          margin-right: 0;
        }
      }

      svg {
        margin-right: 5px;
      }
    }
  }
}

.bins {
  display: flex;
  flex-direction: column;
}
</style>
