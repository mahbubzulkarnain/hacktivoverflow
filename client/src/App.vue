<template>
  <div id="app" class="app">
    <Navbar :bg-navbar="bgNavbar"/>
    <router-view/>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar';

export default {
  data() {
    return {
      bgNavbar: 'white',
      email: '',
      fullname: 'Profile',
      username: '',
      auth2: '',
    };
  },
  created() {
    this.$api.interceptors.response.use(undefined, err => new Promise(function (resolve, reject) {
      if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
        this.$store.dispatch(logout);
      }
      throw err;
    }));
  },
  methods: {
    attachSignin(element) {
      this.auth2.attachClickHandler(element, {},
        this.signIn, (error) => {
          console.log(error);
        });
    },
    checkLogin: function checkLogin(id_token) {
      this.$api
        .post('/auth/verify', {
          id_token,
        })
        .then(({ data }) => {
          this.isLogin = true;
          localStorage.setItem('xf', data.fullname);
          localStorage.setItem('xu', data.username);
          localStorage.setItem('xi', data.id);
          localStorage.setItem('xs', data.token);
          this.$router.replace('/');
        })
        .catch((err) => {
          console.log(err);
        });
    },
    signIn(googleUser) {
      const { id_token } = googleUser.getAuthResponse();
      this.checkLogin(id_token);
    },
  },
  components: {
    Navbar,
  },
};
</script>

<style lang="scss">
  @import "./assets/stylesheet/config";
  @import "~@fortawesome/fontawesome-free/css/all.css";

  $link: $color-primary;
  $title-color: $color-primary;

  $content-heading-color: $color-primary;

  $menu-item-hover-color: white;
  $menu-item-hover-background-color: $color-primary;

  $navbar-dropdown-item-hover-color: white;
  $navbar-dropdown-item-hover-background-color: $color-primary;

  $footer-background-color: white;
  $footer-padding: 0;

  $panel-heading-background-color: white;
  $panel-heading-radius: 0;
  $panel-item-border: none;
  $panel-heading-color: $color-primary;
  $panel-heading-weight: bold;

  .is-fullwidth {
    width: 100%;
  }

  .app {
    padding-top: .5rem;
  }

  .router-link-exact-active {
    @extend .is-active;
  }

  @import "~bulma/bulma.sass";
  @import "~bulma-badge/src/sass/index";

</style>
