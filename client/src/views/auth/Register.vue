<template>
  <div class="columns is-vcentered">
    <form class="column is-two-fifths is-offset-1" @submit.prevent="postRegister">
      <div class="field">
        <div class="field-label is-normal has-text-left">
          <label class="label">First Name</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <input type="text" placeholder="First Name" class="input" v-model="first_name" required>
            </div>
            <p class="help is-danger" v-if="error['first_name']">{{error['first_name'].message}}</p>
          </div>
        </div>
      </div>
      <div class="field">
        <div class="field-label is-normal has-text-left">
          <label class="label">Last Name</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <input type="text" placeholder="Last Name" class="input" v-model="last_name" required>
            </div>
            <p class="help is-danger" v-if="error['last_name']">{{error['last_name'].message}}</p>
          </div>
        </div>
      </div>
      <div class="field">
        <div class="field-label is-normal has-text-left">
          <label class="label">Email</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <input type="text" placeholder="Email" class="input" v-model="email" required>
            </div>
            <p class="help is-danger" v-if="error['email']">{{error['email'].message}}</p>
          </div>
        </div>
      </div>
      <div class="field">
        <div class="field-label is-normal has-text-left">
          <label class="label">Username</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <input type="text" placeholder="Username" class="input" v-model="username" required>
            </div>
            <p class="help is-danger" v-if="error['username']">{{error['username'].message}}</p>
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
            <p class="help is-danger" v-if="error['password']">{{error['password'].message}}</p>
          </div>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <input class="button is-primary is-fullwidth" type="submit" value="Register">
        </div>
      </div>
    </form>
    <section class="column is-two-fifths is-offset-1 hero is-fullheight">
      <div class="hero-body">
        <router-link class="button is-primary is-outlined is-fullwidth" to="/login">
          Login With Email
        </router-link>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      first_name: '',
      last_name: '',
      email: '',
      username: '',
      password: '',
      error: '',
    };
  },
  methods: {
    postRegister() {
      this.error = '';
      const { email } = this;
      const { first_name } = this;
      const { last_name } = this;
      const { username } = this;
      const { password } = this;
      this.$store.dispatch('register', {
        first_name, last_name, email, username, password,
      })
        .then(() => {
          this.$router.replace('/');
        })
        .catch((err) => {
          if (err.response.data && err.response.data.message) {
            this.error = err.response.data.message.errors;
          }
          setTimeout(() => {
            // this.error = '';
          }, 3000);
        });
    },
  },
};
</script>

<style scoped>

</style>
