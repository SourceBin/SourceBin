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

          <font-awesome-icon
            :icon="['fas', 'crown']"
            v-if="auth.user.subscription === 'Pro'"
            class="crown"
          />
        </p>

        <div class="stats">
          <div>
            <font-awesome-icon :icon="['fas', 'calendar-day']" />
            {{ joinDate }}
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
        v-for="(bin, i) in bins"
        :key="i"
        :bin="bin"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Mousetrap from 'mousetrap';

import BinCard from '@/components/BinCard.vue';

import { formatDate } from '@/assets/utils/date.js';

export default {
  components: {
    BinCard,
  },
  middleware: 'auth',
  computed: {
    joinDate() {
      return formatDate(new Date(this.auth.user.createdAt));
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
  head() {
    return {
      title: 'Account',
    };
  },
};
</script>

<style lang="scss" scoped>
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
  margin-bottom: 15px;
  padding: 20px 0;
  background-color: var(--background-panel);
  border-radius: $border-radius;

  @include mq($until: tablet) {
    flex-direction: column;
    align-items: center;
  }

  .avatar {
    width: 100%;
    height: 100%;
    max-width: 100px;
    border-radius: 50%;
    margin: 0 var(--margin-side);

    @include mq($until: tablet) {
      margin-bottom: 15px;
    }
  }

  .info {
    display: flex;
    flex-direction: column;
    justify-content: center;

    .username {
      margin: 0 0 15px;
      font-size: var(--font-size-header);
      color: var(--text-900);

      @include mq($until: tablet) {
        padding: 0 var(--margin-side);
      }

      .crown {
        height: 100%;
        vertical-align: top;
        font-size: var(--font-size-big);
        color: $gold;
      }
    }

    .stats {
      display: inline-flex;
      color: var(--text-700);

      @include mq($until: tablet) {
        justify-content: center;
      }

      div {
        margin-right: 15px;

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
