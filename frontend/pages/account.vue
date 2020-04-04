<template lang="html">
  <div class="account">
    <Login />
  </div>
</template>

<script>
import Mousetrap from 'mousetrap';

import Login from '@/components/account/Login.vue';

export default {
  components: {
    Login,
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
.account {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
