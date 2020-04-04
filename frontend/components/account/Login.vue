<template lang="html">
  <div class="login-container">
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

<style lang="scss" scoped>
@import '@/assets/_globals.scss';

$discord-background: rgba(#7289da, 0.7);
$github-background: rgba($gray, 0.7);

$provider-font-size: 20px;
$provider-icon-font-size: 25px;

.login-container {
  margin: 100px $margin-side-small;
  align-self: center;
  font-family: $font-family;
}

.login {
  h1 {
    margin: 0 0 15px;
    color: rgba($white, 0.9);
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
    color: rgba($white, 0.8);
    text-decoration: none;

    svg {
      vertical-align: middle;
      font-size: $provider-icon-font-size;
    }

    span {
      text-align: center;
      vertical-align: middle;
      font-size: $provider-font-size;
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
