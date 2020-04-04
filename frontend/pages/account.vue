<template lang="html">
  <div class="account">
    Profile
  </div>
</template>

<script>
import Mousetrap from 'mousetrap';

export default {
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
