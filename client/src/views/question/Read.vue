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
  </WithSidebar>
</template>

<script>
import Board from '@/components/Card.vue';

export default {
  name: 'Read',
  data() {
    return {
      question: [],
    };
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
  },
};
</script>

<style scoped lang="scss">
  .mt-30 {
    margin-top: 30px;
  }
</style>
