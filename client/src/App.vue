<template>
  <div id="app">
    <Navbar :bg-navbar="bgNavbar"/>
    <router-view/>
  </div>
</template>

<script>
  import Navbar from './components/Navbar.vue';

  export default {
    beforeRouteUpdate() {
      console.log('beforeupdate');
      this.isLogin = !!this.$auth.currentUser;
    },
    data() {
      return {
        isLogin: !!this.$auth.currentUser,
        bgNavbar: `white`
      }
    },
    components: {
      Navbar
    }
  }
</script>

<style lang="scss">
  @import "~@fortawesome/fontawesome-free/css/all.css";
  @import "~bulma/bulma";
</style>
