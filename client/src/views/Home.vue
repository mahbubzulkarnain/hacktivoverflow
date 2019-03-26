<template>
  <WithSidebar>
    <router-link v-for="question in questions" :key="question._id" class="columns" :to="'/question/'+question.slug">
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
      <div class="column is-four-fifth">{{question.title}}</div>
    </router-link>
  </WithSidebar>
</template>

<script>
// @ is an alias to /src
import Board from '@/components/Card.vue';

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
  components: {
    Board,
  },
};
</script>

<style scoped lang="scss">
  .home {
    margin-top: 20px;
  }
</style>
