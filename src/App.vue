<template>
  <v-app>
    <Header/>

    <UpdateTime />

    <Body/>
  </v-app>
</template>

<script>
import UpdateTime from "@/components/updateTime";
import Header from "@/components/header";
import Body from "@/components/body";

export default {
  name: 'App',

  components: {
    Body,
    UpdateTime,
    Header
  },

  data() {
    return {

    }
  },

  created() {

  }
}
</script>

<style>
#app {
  background: repeating-linear-gradient(
      30deg,
      #fff,
      #fff 10px,
      #efefef 11px
  );
  min-height: 95% !important;
}

.router-anim-enter-active {
  animation: coming .3s;
  animation-delay: .3s;
  opacity: 0;
}

.router-anim-leave-active {
  animation: going .3s;
}

@keyframes going {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(600px);
    opacity: 0;
  }
}

@keyframes coming {
  from {
    transform: translateX(300px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
