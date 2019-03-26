<template>
  <with-sidebar class="home">
    <div v-for="question in questions" :key="question._id">
      <router-link
        :to="'/question/'+question.slug"
        class="columns link-question"
      >
        <div class="column is-one-fifth has-text-centered">
          <div class="columns">
            <div class="column">
              <p>{{question.upvote.length + question.downvote.length}}</p>
              <p>Vote</p>
            </div>
            <div class="column">
              <p>{{question.answer.length}}</p>
              <p>Answer</p>
            </div>
          </div>
        </div>
        <div class="column is-four-fifth">
          <h2 class="subtitle">{{question.title}}</h2>
          <div class="tags" v-if="question.tags && question.tags.length">
            <div class="tag" v-for="(tag,i) in question.tags" :key="i">{{tag}}</div>
          </div>
        </div>
      </router-link>
    </div>
  </with-sidebar>
</template>

<script>

export default {
  name: 'home',
  data() {
    return {
      questions: [],
    };
  },
  mounted() {
    this.$api
      .get('/questions')
      .then(({ data }) => {
        this.questions = data;
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>

<style scoped lang="scss">
  .link-question * {
    color: #000;
  }
</style>
