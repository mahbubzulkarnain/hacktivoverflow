<template>
  <with-sidebar>
    <div class="field">
      <label>Title</label>
      <div class="control">
        <input type="text" v-model="newTitle" class="input" placeholder="Title">
      </div>
    </div>
    <label>Question</label>
    <markdown-editor :highlight="true" v-model="newContent"></markdown-editor>
    <label>Tags</label>
    <input-tag v-model="newTags" placeholder="Tags..."></input-tag>
    <div class="mt-30"/>
    <div class="is-pulled-right">
      <button class="button is-primary" @click="postQuestion">Post</button>
    </div>
  </with-sidebar>
</template>

<script>
import markdownEditor from 'vue-simplemde/src/markdown-editor.vue';
import InputTag from 'vue-input-tag';
import hljs from 'highlight.js';

window.hljs = hljs;
export default {
  name: 'Create',
  data() {
    return {
      slug: '',
      newTitle: '',
      newContent: '',
      newTags: [],
    };
  },
  mounted() {
    if (this.$router.currentRoute
        && this.$router.currentRoute.params
        && this.$router.currentRoute.params.slug
    ) {
      this.slug = this.$router.currentRoute.params.slug;
      this.$api
        .get(`/questions/${this.slug}`)
        .then(({ data }) => {
          this.newTitle = data.title;
          this.newContent = data.content;
          this.newTags = data.tags;
        })
        .catch((err) => {
          console.error(err);
        });
    }
  },
  methods: {
    postQuestion() {
      if (this.slug) {
        this.$api
          .patch(`/questions/${this.slug}`, {
            title: this.newTitle,
            content: this.newContent,
            tags: this.newTags,
          })
          .then(({ data }) => {
            this.$router.push(`/question/${data.slug}`);
          });
      } else {
        this.$api
          .post('/questions', {
            title: this.newTitle,
            content: this.newContent,
            tags: this.newTags,
          })
          .then(({ data }) => {
            console.log(data);
            this.$router.replace(`/question/${data.slug}`);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
  components: {
    markdownEditor,
    InputTag,
  },
};
</script>

<style scoped lang="scss">
  @import '~simplemde/dist/simplemde.min.css';
  @import '~simplemde/dist/simplemde.min.css';
  @import '~highlight.js/styles/atom-one-dark.css';

</style>
