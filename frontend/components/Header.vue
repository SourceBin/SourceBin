<template lang="html">
  <header>
    <nav>
      <ul>
        <li>
          <nuxt-link
            to="/"
            class="title"
          >
            <span>{</span>SourceBin<span>}</span>
          </nuxt-link>
        </li>
      </ul>

      <ul>
        <li v-if="!$store.getters.pro">
          <nuxt-link
            to="/pro"
            class="go-pro"
          >
            <span>Upgrade Now -</span> Go Pro
          </nuxt-link>
        </li>

        <li>
          <nuxt-link
            @click.native="$store.commit('bin/reset')"
            to="/"
          >
            <font-awesome-icon :icon="['fas', 'plus']" />
          </nuxt-link>
        </li>

        <li>
          <nuxt-link to="/settings">
            <font-awesome-icon :icon="['fas', 'sliders-h']" />
          </nuxt-link>
        </li>

        <li>
          <nuxt-link to="/account">
            <img
              v-if="$store.state.auth.loggedIn"
              :src="$store.state.auth.user.about.avatarURL"
              alt="avatar"
            >

            <font-awesome-icon
              v-else
              :icon="['fas', 'user']"
            />
          </nuxt-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style lang="scss" scoped>
@import 'sass-mq';
@import '@/assets/styles/_variables.scss';

nav {
  --height: 50px;
  --icon-size: 20px;

  display: flex;
  justify-content: space-between;
  margin: 0 var(--margin-side);
  height: var(--height);
  font-family: var(--font-family);

  @include mq($until: tablet) {
    --height: 40px;
    --icon-size: 18px;
  }
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    float: left;
    margin-right: 20px;
    line-height: var(--height);

    &:last-child {
      margin-right: 0;
    }

    a {
      display: block;
      color: var(--text-700);
      height: var(--height);
      text-decoration: none;

      &:hover {
        color: var(--text-900);
      }

      &.title {
        // stylelint-disable-next-line scale-unlimited/declaration-strict-value
        font-family: monospace;
        font-size: var(--font-size-header);
        font-weight: 700;

        @include mq($until: tablet) {
          font-size: var(--font-size-large);
        }

        span {
          color: $red;
        }
      }

      &.go-pro {
        color: $red;
        font-weight: 700;
        font-size: var(--font-size-big);

        @include mq($until: tablet) {
          span {
            display: none;
          }
        }

        &:hover {
          color: $red-modifier-hover;
        }
      }

      svg {
        height: var(--height);
        font-size: var(--icon-size);
      }

      img {
        width: calc(var(--icon-size) + 5px);
        border-radius: 50%;
        vertical-align: middle;
      }
    }
  }
}
</style>
