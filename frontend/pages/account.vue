<template lang="html">
  <div class="account">
    <div class="about">
      <img
        :src="`/proxy/?q=${encodeURIComponent(auth.user.about.avatarURL)}`"
        alt="avatar"
        class="avatar"
      >

      <h1 class="username">
        {{ auth.user.username }}
      </h1>
    </div>

    <div class="bins">
      <BinCard
        v-for="(bin, i) in auth.user.bins"
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

export default {
  components: {
    BinCard,
  },
  computed: mapState(['auth']),
  async beforeMount() {
    try {
      await this.$store.dispatch('auth/loadUser');
    } catch {
      this.$router.push('/login');
    }
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
@import 'sass-mq';
@import '@/assets/_globals.scss';

.account {
  display: flex;
  align-items: flex-start;
  align-self: center;
  margin: 0 $margin-side 15px;
  font-family: $font-family;

  @include mq($until: tablet) {
    flex-direction: column;
  }
}

.about {
  margin-right: 75px;

  @include mq($until: tablet) {
    margin-right: 0;
  }

  .avatar {
    width: 300px;
  }

  .username {
    margin: 10px 0;
    color: rgba($white, 0.8);
  }
}

.bins {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;

  @include mq($until: desktop) {
    grid-template-columns: 1fr;
  }
}
</style>
