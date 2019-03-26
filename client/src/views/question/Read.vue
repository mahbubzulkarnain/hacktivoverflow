<template>
  <WithSidebar>
    <Board
      :prop="question"
      :endpoint="`/questions/${question.slug}`"
    />
    <div class="mt-30" v-if="question && question.answer && question.answer.length">
      <div class="subtitle">{{question.answer.length}} Answer</div>
      <Board
        v-for="item in question.answer"
        :prop="item"
        :endpoint="`/questions/${question.slug}/answers/${item._id}`"
        :key="item._id"
      />
    </div>
    <div class="mt-30">
      <markdown-editor :highlight="true" v-model="newContent"></markdown-editor>
      <div class="is-pulled-right">
        <button class="button is-primary" @click="postAnswer">Post</button>
      </div>
    </div>
  </WithSidebar>
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
  methods: {
    postAnswer() {
      console.log(this.newContent);
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
        this.question = data;
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
  @import '~simplemde/dist/simplemde.min.css';
  @import '~simplemde/dist/simplemde.min.css';
  @import '~highlight.js/styles/atom-one-dark.css';

  .mt-30 {
    margin-top: 30px;
  }
</style>
