<template>
  <with-sidebar class="home">
    <div v-for="question in questions" :key="question._id" class="columns">
      <div class="column is-one-fifth has-text-centered">
        <router-link
          :to="'/question/'+question.slug"
          class="columns link-question"
        >
          <div class="column">
            <p>{{question.upvote.length + question.downvote.length}}</p>
            <p>Vote</p>
          </div>
          <div class="column">
            <p>{{question.answer.length}}</p>
            <p>Answer</p>
          </div>
        </router-link>
      </div>
      <div class="column is-four-fifth">
        <router-link
          :to="'/question/'+question.slug"
        >
          <h2 class="subtitle">{{question.title}}</h2>
        </router-link>
        <div class="is-pulled-right">
          <p class="is-size-7">
            {{
            question.updated_at
            ? 'modified ' + timeAgo(question.updated_at)
            : 'asked ' + timeAgo(question.created_at)
            }}
            {{question.author.first_name +' '+question.author.last_name}}</p>
        </div>
        <div class="tags" v-if="question.tags && question.tags.length">
          <router-link class="tag" v-for="(tag,i) in question.tags" :key="i" :to="'/tags/'+tag">
            {{tag}}
          </router-link>
        </div>
      </div>

    </div>
  </with-sidebar>
</template>

<script>

import timeAgoParsed from '../helpers/timeAgo';

export default {
  name: 'home',
  data() {
    return {
      questions: [],
    };
  },
  methods: {
    timeAgo(date) {
      return timeAgoParsed(date);
    },
  },
  mounted() {
    if (this.$router.currentRoute.name === 'question-watched') {
      this.$api
        .get('/watched')
        .then(({ data }) => {
          this.questions = data;
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (this.$router.currentRoute.params && this.$router.currentRoute.params.slug) {
      this.$api
        .get(`/tags/${this.$router.currentRoute.params.slug}`)
        .then(({ data }) => {
          this.questions = data;
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.$api
        .get('/questions')
        .then(({ data }) => {
          this.questions = data;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
};
</script>

<style scoped lang="scss">
  .link-question * {
    color: #000;
  }
</style>
