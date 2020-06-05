<script>
export default {
  render(createElement) {
    return createElement(
      'div',
      { class: 'carbonads' },
      [
        createElement(
          'script',
          {
            attrs: {
              id: '_carbonads_js',
              type: 'text/javascript',
              src: '//cdn.carbonads.com/carbon.js?serve=CE7IP2JN&placement=sourcebin',
            },
          },
        ),
      ],
    );
  },
};
</script>

<style lang="scss">
@import 'sass-mq';

$font-size-text: 13px;
$font-size-poweredby: 9px;

.carbonads {
  display: flex;
  justify-content: center;
  height: 100px;
  max-width: 330px;

  @include mq($from: desktop) {
    margin-left: 15px;
  }
}

#carbonads {
  display: flex;
  position: relative;
  background-color: var(--background-secondary);
  font-family: var(--font-family);
  color: var(--text-700);

  a {
    color: inherit;
    text-decoration: none;
  }

  .carbon-wrap {
    display: flex;
  }

  .carbon-img img {
    display: block;
  }

  .carbon-text {
    margin-bottom: 10px;
    font-size: $font-size-text;
    padding: 7px;
    line-height: 1.5;
  }

  .carbon-poweredby {
    position: absolute;
    bottom: 5px;
    right: 5px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
    font-size: $font-size-poweredby;
  }
}
</style>
