<template>
  <div class="comment-wrapper">
    <div class="comment-container">
      <div class="comment-section">
        <div class="comment-info">
          <img class="author-avatar" :src="comment.user.avatar || '/img/avatars/no_avatar.png'">
          <div class="author-info">
            <span class="author-name">{{ comment.user.name }}</span>
            <span>{{ $showDateHuman(comment.createdAt) }}</span>
            <div>
              <span @click="quote" class="quote-author pointer">{{ $t('reply') }}</span>
              <i v-if="isAdmin" class="ml-1 fas fa-trash-alt pointer" @click="removeComment(comment.id)"></i>
            </div>

          </div>
        </div>
        <div v-if="comment.quote" class="quote-container">
          <blockquote class="quote-text">
            <div class="quote-left">
              <i class="fas fa-quote-left"></i>
            </div>
            <div class="quote-right">
              <i class="fas fa-quote-right"></i>
            </div>
            <em>{{ comment.quote.user.name }} ({{ $showDate(comment.quote.date) }}): </em>
            <p>"{{ comment.quote.body }}"</p>
          </blockquote>
        </div>
        <div class="comment-text">{{ comment.body }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>

const isAdmin = useState('isAdmin');

const props = defineProps({
  comment: Object,
});

const emit = defineEmits(['quoting', 'delCom'])

function quote() {
  emit('quoting', props.comment)
}

function removeComment(id) {
  if (confirm('Are you sure?')) {
    emit('delCom', id)
  }
}

</script>

<!--<script>
export default {
  props: ['comment'],

  methods: {
    quote() {
      this.$emit('quoting', this.comment)
    },
    removeComment(id) {
      if (confirm('Are you sure?')) {
        this.$emit('delCom', id)
      }
    }
  }

}
</script>-->

<style lang="scss" scoped>
.comment-wrapper {
  display: flex;
  justify-content: center;
  flex-direction: row;
}

.comment-container {
  width: 100%;
}

.comment-section {
  display: flex;
  flex-direction: column;
}

.comment-info {
  display: flex;
  flex-direction: row;
}

.author-avatar {
  border-radius: 50%;
  width: 80px;
  height: 80px;
}

.author-info {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-left: 1rem;
}

.author-name {
  display: block;
}

.quote-author {
  text-decoration: underline;

  &:hover {
    text-decoration: none;
  }
}

.quote-container {
  margin-top: 1rem;
}

.quote-text {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.quote-left {
  position: absolute;
  top: 0;
  left: 5px;

  i {
    color: #fad402;
  }
}

.quote-right {
  i {
    color: #fad402;
  }

  position: absolute;
  bottom: 0;
  right: 5px;
}

.comment-text {
  margin-top: 1rem;
  text-align: left;
  white-space: break-spaces;
}

blockquote {
  border-left: 5px solid #fce27c;
  margin: 0;
  padding: 15px;
  position: relative;
  background-color: #f6ebc1;
  border-radius: 5px;
  color: black;

  p {
    margin: 0;
    text-align: left;
  }
}

</style>