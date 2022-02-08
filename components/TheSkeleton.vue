<template>
  <div class="job">
    <div class='profile-info'>
      <h2/>
      <h3/>
      <p/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@keyframes pulse-bg {
  0% {
    background-color: #ddd;
  }
  50% {
    background-color: #c0bdbd;
  }
  100% {
    background-color: #ddd;
  }
}

.profile-info {
  width: 85%;
  padding-left: 10px;
  box-sizing: border-box;
  padding-bottom: 4rem;

  h2 {
    content: ' ';
    width: 100px;
    height: 16px;
    background-color: #ddd;
    margin: 10px 0;
    animation: pulse-bg 1s infinite;
  }

  h3 {
    content: ' ';
    width: 100%;
    height: 24px;
    background-color: #ddd;
    margin: 10px 0;
    animation: pulse-bg 1s infinite;
  }

  p {
    width: 80%;
    background-color: #ddd;
    height: 16px;
    line-height: 140%;
    animation: pulse-bg 1s infinite;
  }
}


</style>