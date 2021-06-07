<template>
  <div>
    <p class="blockquote-footer mx-5 my-2 update">Дата обновления: {{ date }}</p>
  </div>
</template>

<script>
import {modifyTime} from "@/service/service";

export default {

  data() {
    return {
      date: '',
      timer: ''
    }
  },

  mounted() {
    this.addTime();
  },

  created() {
    this.timer = setInterval(this.addTime, 300000);
  },

  beforeDestroy() {
    clearInterval(this.timer);
  },

  methods: {
    addTime() {
      modifyTime()
        .then(time => {
          if (this.date !== time) {
            this.date = time;
          }
        });
    }
  }
}

</script>

<style scoped>
.update {
  width: 45%;
  font-size: 10px;
  top: 60px;
  left: 0;
  color: gray;
}
</style>