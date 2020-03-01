<template lang="html">
  <header>
    <nav>
      <ul>
        <li>
          <nuxt-link
            to="/"
            class="title"
          >
            SourceBin
          </nuxt-link>
        </li>
      </ul>

      <ul>
        <li>
          <nuxt-link
            @click.native="$store.commit('bin/reset')"
            to="/"
          >
            <PlusIcon />
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/settings">
            <TuneIcon />
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/account">
            <AccountIcon />
          </nuxt-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import PlusIcon from 'mdi-vue/Plus.vue';
import TuneIcon from 'mdi-vue/Tune.vue';
import AccountIcon from 'mdi-vue/Account.vue';

export default {
  components: {
    PlusIcon,
    TuneIcon,
    AccountIcon,
  },
};
</script>

<style lang="scss" scoped>
@import 'sass-mq';
@import '@/assets/_globals.scss';

$height: 50px;

$font-size: 20px;
$font-size-title: 25px;
$font-size-small: 17px;

nav {
  margin: 0 $margin-side;
  height: $height;
  display: flex;
  justify-content: space-between;
  font-family: $font-family;
  font-size: $font-size;

  @include mq($until: desktop) {
    margin: 0 $margin-side-small;
    font-size: $font-size-small;
  }
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

li {
  float: left;
  margin-right: 15px;
  line-height: $height;

  &:last-child {
    margin-right: 0;
  }

  .mdi {
    vertical-align: -0.25em;
  }
}

a {
  color: $white;
  opacity: 0.9;
  text-decoration: none;
}

.title {
  font-weight: 700;
  font-size: $font-size-title;
}
</style>
