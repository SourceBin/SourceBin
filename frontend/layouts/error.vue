<template lang="html">
  <div>
    <h1>{{ error.statusCode }}</h1>
    <h2>{{ error.message }}</h2>

    <nuxt-link to="/">
      Home page
    </nuxt-link>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      required: true,
    },
  },
};
</script>
