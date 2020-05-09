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

export default {
  components: {
    BinCard,
  },
  middleware: 'auth',
  computed: mapState(['auth']),
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
@import 'sass-mq';

.account {
  display: flex;
  align-items: flex-start;
  align-self: center;
  margin: 0 var(--margin-side);
  padding-bottom: 15px;
  font-family: var(--font-family);

  @include mq($until: desktop) {
    flex-direction: column;
  }
}

.about {
  margin: 0 75px 25px 0;

  @include mq($until: tablet) {
    margin-right: 0;
    display: flex;
  }

  .avatar {
    width: 100%;
    height: 100%;
    max-width: 300px;
    margin-bottom: 10px;

    @include mq($until: tablet) {
      width: 75px;
      margin-bottom: 0;
      margin-right: 10px;
    }
  }

  .username {
    margin: 0;
    color: var(--text-800);
  }
}

.bins {
  display: grid;
  grid-template-columns: repeat(2, minmax(200px, 400px));
  grid-gap: 20px;

  @include mq($until: tablet) {
    grid-template-columns: minmax(200px, 400px);
  }
}
</style>
