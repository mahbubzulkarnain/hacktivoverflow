<template>
  <section class="sectionn container">
    <div class="columns is-vcentered">
      <form class="column is-two-fifths is-offset-1" @submit.prevent="postLogin">
        <div class="notification is-danger" v-if="error">
          {{error}}
        </div>
        <div class="field">
          <div class="field-label is-normal has-text-left">
            <label class="label">Email</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input
                  type="text"
                  placeholder="Username/Email"
                  class="input"
                  v-model="email"
                  required
                >
              </div>
            </div>
          </div>
        </div>
        <div class="field">
          <div class="field-label is-normal has-text-left">
            <label class="label">Password</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input
                  type="password"
                  placeholder="Password"
                  class="input"
                  autocomplete="off"
                  v-model="password"
                  required
                >
              </div>
            </div>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <input class="button is-primary is-fullwidth" type="submit" value="Login">
          </div>
        </div>
      </form>
      <section class="column is-two-fifths is-offset-1 hero is-fullheight">
        <div class="hero-body">
          <router-link class="button is-primary is-outlined is-fullwidth" to="/register">
            Register With Email
          </router-link>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      error: '',
    };
  },
  methods: {
    postLogin() {
      const user = this.email;
      const { password } = this;
      this.$store.dispatch('login', { user, password })
        .then(() => {
          this.$router.replace('/');
        })
        .catch((err) => {
          if (err.response.data && err.response.data.message) {
            this.error = err.response.data.message;
          }
          setTimeout(() => {
            this.error = '';
          }, 3000);
        });
    },
  },
};
</script>

<style scoped>

</style>
