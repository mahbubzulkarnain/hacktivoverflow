<template>
  <section class="container section home">
    <div class="columns">
      <div class="column is-one-fifth">

      </div>
      <div class="column is-three-fifths">
        <slot></slot>
      </div>
      <div class="column is is-one-fifth">

      </div>
    </div>
  </section>
</template>

<script>

export default {
  name: 'WithSidebar',
};
</script>

<style scoped>

</style>
