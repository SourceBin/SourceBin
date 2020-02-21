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
          <nuxt-link to="/">
            <font-awesome-icon icon="plus" />
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/settings">
            <font-awesome-icon icon="sliders-h" />
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/account">
            <font-awesome-icon icon="user" />
          </nuxt-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

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
}

a {
  color: $white;
  opacity: 90%;
  text-decoration: none;
}

.title {
  font-weight: 700;
  font-size: $font-size-title;
}
</style>
