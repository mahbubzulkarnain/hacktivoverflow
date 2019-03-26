<template>
  <div class="card">
    <div class="card-content">
      <div class="side has-text-centered">
        <div @click="upvote()"><i class="fa fa-chevron-up fa-3x"></i></div>
        <div>
          {{
          (item.upvote && item.upvote.length || 0) - (item.downvote && item.downvote.length || 0)
          }}
        </div>
        <div @click="downvote()"><i class="fa fa-chevron-down fa-3x"></i></div>
      </div>
      <div class="content">
        <div class="title" v-if="item.title">{{item.title}}</div>
        <hr v-if="item.title">
        <p v-html="content"></p>
        <div class="tags" v-if="item.tags && item.tags.length">
          <span class="tag" v-for="tag in item.tags" :key="tag.id">{{tag.title}}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import marked from 'marked';

export default {
  name: 'Board',
  props: {
    endpoint: {
      default: '',
    },
    prop: {
      default: {
        content: 'Not Found',
      },
    },
  },
  data() {
    return {
      slug: '',
      newItem: {},
    };
  },
  computed: {
    item() {
      return {
        ...this.prop,
        ...this.newItem,
      };
    },
    content() {
      try {
        return marked(this.item.content, { sanitize: true });
      } catch (e) {
        return '';
      }
    },
  },
  methods: {
    upvote() {
      this.$api
        .patch(`${this.endpoint}/up`)
        .then(({ data }) => {
          this.newItem = data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    downvote() {
      console.log('downvote');
      this.$api
        .patch(`${this.endpoint}/down`)
        .then(({ data }) => {
          this.newItem = data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped lang="scss">
  .card {
    .card-content {
      padding: .5rem;
      display: flex;

      .side,
      .content {
        padding: .5rem;
      }

      .side {
        width: 10%;
      }

      .content {
        width: 90%;
      }
    }
  }
</style>
