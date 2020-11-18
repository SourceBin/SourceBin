<template lang="html">
  <footer>
    <ul>
      <li>
        <nuxt-link to="/terms">
          Terms
        </nuxt-link>
      </li>

      <li>
        <nuxt-link to="/privacy">
          Privacy
        </nuxt-link>
      </li>

      <li>
        <a href="https://status.sourceb.in">
          Status
        </a>
      </li>
    </ul>

    <ul>
      <li>
        <a href="/discord">
          <font-awesome-icon :icon="['fab', 'discord']" />
        </a>
      </li>

      <li>
        <a href="/github">
          <font-awesome-icon :icon="['fab', 'github']" />
        </a>
      </li>

      <li>
        <a href="/twitter">
          <font-awesome-icon :icon="['fab', 'twitter']" />
        </a>
      </li>
    </ul>

    <ul>
      <li>
        <nuxt-link to="/pro">
          Go Pro
        </nuxt-link>
      </li>

      <li>
        <nuxt-link to="/account/billing">
          Billing
        </nuxt-link>
      </li>
    </ul>
  </footer>
</template>

<style lang="scss" scoped>
@import 'sass-mq';

footer {
  display: flex;
  margin: 0 calc(var(--margin-side) * 3);
  padding: var(--margin-between) 0;
  border-top: 1px solid var(--background-modifier-accent);
  font-family: var(--font-family);
  opacity: 0.5;
  transition: opacity 0.2s ease;

  @include mq($until: tablet) {
    flex-direction: column;
    align-items: center;

    ul:not(:last-child) {
      margin-bottom: var(--margin-between);
    }
  }

  &:hover {
    opacity: 1;
  }

  ul {
    flex: 1;
    display: flex;
    justify-content: center;
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      margin: 0 var(--margin-between);

      a {
        font-size: var(--font-size-regular);
        color: var(--text-700);
        text-decoration: none;

        &:hover {
          color: var(--text-900);
        }

        svg {
          font-size: var(--font-size-large);
        }
      }
    }
  }
}
</style>
