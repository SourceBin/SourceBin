<template lang="html">
  <footer>
    <div>
      <h1>Community</h1>

      <ul>
        <li>
          <a href="/discord">
            Discord
          </a>
        </li>

        <li>
          <a href="/github">
            GitHub
          </a>
        </li>
      </ul>
    </div>

    <div>
      <h1>Company</h1>

      <ul>
        <li>
          <nuxt-link to="/terms">
            Terms of service
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
    </div>

    <div>
      <h1>Pro</h1>

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
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@import 'sass-mq';

footer {
  display: flex;
  justify-content: center;
  margin: auto calc(var(--margin-side) * 3) var(--margin-between);
  padding-top: 25px;
  border-top: 1px solid var(--background-modifier-accent);
  font-family: var(--font-family);
  opacity: 0.5;
  transition: opacity 0.2s ease;

  @include mq($until: tablet) {
    flex-direction: column;
    align-items: center;
  }

  &:hover {
    opacity: 1;
  }

  div {
    margin: 0 50px;

    @include mq($until: tablet) {
      margin-bottom: var(--margin-between);
      width: 100%;
    }

    h1 {
      margin: 0 0 10px;
      font-size: var(--font-size-big);
      color: var(--text-900);
    }

    ul {
      margin: 0;
      padding: 0;
      list-style: none;

      li {
        margin-bottom: 5px;

        a {
          font-size: var(--font-size-regular);
          color: var(--text-800);
          text-decoration: none;
        }
      }
    }
  }
}
</style>
