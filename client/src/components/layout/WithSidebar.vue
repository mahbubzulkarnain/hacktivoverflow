<template>
  <section class="container section home">
    <div class="columns">
      <div class="column is-one-fifth">

      </div>
      <div class="column is-three-fifths">
        <slot></slot>
      </div>
      <div class="column is is-one-fifth">
        <aside class="menu" v-if="isLogin">
          <p class="menu-label">
            <router-link class="button is-primary" to="/watched" v-if="!isShowWatchedPage">
              <i class="fa fa-eye" style="padding-right: 10px;"></i>
              Filter by watched tags
            </router-link>
            <router-link class="button is-normal" to="/" v-if="isShowWatchedPage">
              <i class="fa fa-eye-slash" style="padding-right: 10px;"></i>
              Filter by watched tags
            </router-link>
          </p>
          <p class="menu-label" ref="">
            Watched Tag
            <span @click="editWatchedForm" ref="btnShowFormEdit">
              <i class="fa fa-pencil-alt" ref="btnShowFormEditIcon"></i>
              edit
            </span>
          </p>
          <div class="tags" ref="listTag" v-if="!formWatchedIsShow">
            <router-link class="tag" :to="'/tags/'+tag" v-for="(tag, i) in tags" :key="i">
              {{tag}}
            </router-link>
          </div>
          <div v-if="formWatchedIsShow">
            <input-tag v-model="tags"></input-tag>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>

<script>
import InputTag from 'vue-input-tag';

export default {
  name: 'WithSidebar',
  data() {
    return {
      formWatchedIsShow: false,
      tags: [],
      isShowWatchedPage: false,
    };
  },
  methods: {
    editWatchedForm() {
      if (!this.formWatchedIsShow) {
        this.$refs.btnShowFormEdit.innerHTML = '<i class="fa fa-save"  ref="btnShowFormEditIcon"></i> save';
        this.formWatchedIsShow = true;
      } else {
        console.log(this.tags);
        this.$api
          .post('/tags/watched', { tags: this.tags })
          .then(({ data }) => {
            this.tags = data.watched;
            this.$refs.btnShowFormEdit.innerHTML = '<i class="fa fa-pencil-alt"  ref="btnShowFormEditIcon"></i> edit';
            this.formWatchedIsShow = false;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
  mounted(){
    this.isShowWatchedPage = this.$router.currentRoute.name === 'question-watched';
  },
  created() {
    this.$api
      .get('/users')
      .then(({ data }) => {
        this.tags = data.watched;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  computed: {
    isLogin() {
      return this.$store.getters.isLogin;
    },
    user() {
      return this.$store.getters.user;
    },
  },
  components: {
    InputTag,
  },
};
</script>

<style scoped>

</style>
