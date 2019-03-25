<template>
  <section class="container section home">
    <div class="columns">
      <div class="column is-one-fifth">
        left
      </div>
      <div class="column is-three-fifths">
        <Board/>
      </div>
      <div class="column is is-one-fifth">
        right
      </div>
    </div>
  </section>
</template>

<script>
  // @ is an alias to /src
  import HelloWorld from '@/components/HelloWorld.vue';
  import Board from '@/components/Card.vue';

  export default {
    name: 'home',
    components: {
      HelloWorld,
      Board
    },
  };
</script>

<style scoped lang="scss">
  .home {
    margin-top: 20px;
  }
</style>
