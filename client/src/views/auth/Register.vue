<template>
  <div class='container'>
    <div class="columns is-vcentered">
      <form class="column is-two-fifths is-offset-1" @submit.prevent="postRegister">
        <div class="field">
          <div class="field-label is-normal has-text-left	">
            <label class="label">Display Name</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input type="text" placeholder="Display Name" class="input" v-model="name" required>
              </div>
              <p class="help is-danger" v-if="error['name']">{{error['name'].message}}</p>
            </div>
          </div>
        </div>
        <div class="field">
          <div class="field-label is-normal has-text-left	">
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
          <div class="field-label is-normal has-text-left	">
            <label class="label">Password</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input type="password" placeholder="Password" class="input" autocomplete="off" v-model="password"
                       required>
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
          <router-link class="button is-primary is-outlined is-fullwidth" to="/login">Login With Email</router-link>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Register',
    data() {
      return {
        name: ``,
        email: '',
        password: ``,
        error: '',
      };
    },
    methods: {
      postRegister: function () {
        this.error = '';
        this.$auth.createUserWithEmailAndPassword(this.email, this.password)
          .then(() => {
            return this.$auth.currentUser
          })
          .then((user) => {
            user.updateProfile({
              displayName: this.name
            });
            this.$parent.isLogin = true;
            this.$router.replace('/')
          })
          .catch((err) => {

          })
      },
    },
  };
</script>

<style scoped>

</style>
