<template lang="html">
  <header>
    <nav>
      <ul>
        <slot />
      </ul>

      <ul>
        <li class="no-select">
          SourceBin
        </li>
      </ul>
    </nav>
  </header>
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Raleway');

$height: 30px;

$font: 13px Raleway, monospace;
$color: #0d0d0d;

$background: #c0c0c0;
$background-hover: #a7a7a7;

header {
  background: $background;
  color: $color;
  font: $font;
  user-select: none;
  cursor: default;
}

nav {
  display: flex;
  justify-content: space-between;
}

ul {
  margin: 0;
  padding: 0;
  min-height: $height;
  list-style: none;
}

li {
  float: left;
  display: block;
  padding: 0 15px;
  line-height: $height;

  &:not(.no-select) {
    cursor: pointer;

    &:hover {
      background: $background-hover;
    }
  }
}
</style>
