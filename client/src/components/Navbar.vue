<template>
  <nav class="navbar is-fixed-top container" role="navigation" aria-label="main navigation"
       :style="{'background-color': $parent.bgNavbar}">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item">Hacktiv Overflow
      </router-link>
      <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false"
         data-target="navbarBasicExample">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div id="navbarBasicExample" class="navbar-menu">
      <div class="navbar-end" v-if="!$parent.isLogin">
        <div class="navbar-item">
          <div class="buttons">
            <router-link to="/register" class="button is-primary">
              <strong>Register</strong>
            </router-link>
          </div>
        </div>
        <div class="navbar-item">
          <div class="buttons">
            <router-link to="/login" class="button is-primary is-outlined">
              <strong>Login</strong>
            </router-link>
          </div>
        </div>
      </div>
      <div class="navbar-end" v-else>
        <div class="navbar-item">
          <div class="buttons">
            <a @click="logout()" class="button is-primary">
              <strong>Logout</strong>
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
  export default {
    name: 'Navbar',
    data() {
      return {
        categories: [
          {
            title: 'Handphone',
            slug: 'handphone',
          },
          {
            title: 'Computer',
            slug: 'computer',
          },
          {
            title: 'Mobil',
            slug: 'mobil',
          },
          {
            title: 'Motor',
            slug: 'motor',
          },
          {
            title: 'Dipan',
            slug: 'dipan',
          },
          {
            title: 'Games',
            slug: 'games',
          },
          {
            title: 'Fashion',
            slug: 'fashion',
          },
        ],
        carts: [
          {
            images: '',
            title: 'Lorem Ipsum, Lorem Ipsum, Lorem Ipsum.',
            price: 'Rp.100000',
            quantity: '3',
          },
          {
            images: '',
            title: 'Lorem Ipsum, Lorem Ipsum, Lorem Ipsum.',
            price: 'Rp.100000',
            quantity: '3',
          },
          {
            images: '',
            title: 'Lorem Ipsum, Lorem Ipsum, Lorem Ipsum, Lorem Ipsum, Lorem Ipsum.',
            price: 'Rp.100000',
            quantity: '3',
          },
          {
            images: '',
            title: 'Lorem Ipsum, Lorem Ipsum, Lorem Ipsum.',
            price: 'Rp.10000000',
            quantity: '3',
          },
          {
            images: '',
            title: 'Lorem Ipsum, Lorem Ipsum, Lorem Ipsum.',
            price: 'Rp.10000000',
            quantity: '3',
          },
        ],
      };
    },
    methods: {
      logout() {
        this.$auth.signOut().then(() => {
          this.$parent.isLogin = false;
          this.$router.replace('/login');
        })
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "../assets/stylesheet/config";

  .navbar {
    .navbar-dropdown {
      border: none;
    }

    .navbar-brand {
      margin-left: 30px;
      margin-right: 30px;
      background-color: $color-primary;

      > .navbar-item {
        color: white;
        font-size: large;
      }
    }

    .navbar-menu {
      .navbar-end {
        background-color: white;

        .navbar-link {
          .icon {
            padding-right: 10px;
          }
        }
      }
    }
  }
</style>
