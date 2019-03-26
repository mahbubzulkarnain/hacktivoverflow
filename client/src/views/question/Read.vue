<template>
  <div>
    <Board
      :prop="question"
      :endpoint="`/questions/${question.slug}`"
    />
    <div class="mt-30 subtitle">{{question.answer && question.answer.length || 0}} Answer</div>
    <div v-if="question && question.answer && question.answer.length">
      <Board
        v-for="item in question.answer"
        :prop="item"
        :endpoint="`/questions/${question.slug}/answers/${item._id}`"
        :key="item._id"
      />
    </div>
    <div class="mt-30" v-if="isLogin">
      <markdown-editor :highlight="true" v-model="newContent"></markdown-editor>
      <div class="mt-30"/>
      <div class="is-pulled-right">
        <button class="button is-primary" @click="postAnswer">Post</button>
      </div>
    </div>
  </div>
</template>

<script>
import Board from '@/components/Card.vue';
import markdownEditor from 'vue-simplemde/src/markdown-editor.vue';

import hljs from 'highlight.js';

window.hljs = hljs;

export default {
  name: 'Read',
  data() {
    return {
      question: {},
      newContent: '',
    };
  },
  computed: {
    isLogin() {
      return this.$store.getters.isLogin;
    },
    user() {
      return this.$store.getters.user;
    },
  },
  methods: {
    postAnswer() {
      this.$api
        .post(`/questions/${this.question.slug}/answers`, {
          content: this.newContent,
        })
        .then(({ data }) => {
          this.question.answer.push(data);
        })
        .catch((e) => {
          console.log(e);
        });
      this.newContent = '';
    },
  },
  mounted() {
    this.$api
      .get(`/questions/${this.$router.currentRoute.params.slug}`)
      .then(({ data }) => {
        if (!data) {
          this.$router.replace('/');
        } else {
          this.question = data;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
  components: {
    Board,
    markdownEditor,
  },
};
</script>

<style scoped lang="scss">
  @import "../../assets/stylesheet/config";
  @import '~simplemde/dist/simplemde.min.css';
  @import '~simplemde/dist/simplemde.min.css';
  @import '~highlight.js/styles/atom-one-dark.css';
</style>
