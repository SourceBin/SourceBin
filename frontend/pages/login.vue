<template lang="html">
  <div class="login-container">
    <h1
      v-if="$route.query.error"
      class="error"
    >
      {{ $route.query.error }}
    </h1>

    <div class="login">
      <h1>Get started by logging in</h1>

      <div class="oauth">
        <a
          href="/api/auth/discord"
          class="discord"
        >
          <font-awesome-icon :icon="['fab', 'discord']" /> <span>Discord</span>
        </a>

        <a
          href="/api/auth/github"
          class="github"
        >
          <font-awesome-icon :icon="['fab', 'github']" /> <span>GitHub</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'unauth',
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';

$discord-background: rgba(#7289da, 0.7);
$github-background: rgba($black-700, 0.7);

$provider-icon-font-size: 30px;

.login-container {
  margin: 75px var(--margin-side);
  align-self: center;
  font-family: var(--font-family);
}

.error {
  padding: 20px 25px;
  color: $white-900;
  background-color: $red;
  text-align: center;
  border-radius: 3px;
}

.login {
  h1 {
    margin: 0 0 15px;
    color: var(--text-800);
    text-align: center;
  }
}

.oauth {
  display: flex;
  flex-direction: column;

  a {
    display: grid;
    grid-template-columns: auto 1fr;
    margin: 3px 0;
    padding: 10px 20px;
    color: var(--text-900);
    text-decoration: none;

    svg {
      vertical-align: middle;
      font-size: $provider-icon-font-size;
    }

    span {
      text-align: center;
      vertical-align: middle;
      font-size: var(--font-size-large);
    }

    &.discord {
      background-color: $discord-background;
    }

    &.github {
      background-color: $github-background;
    }
  }
}
</style>
