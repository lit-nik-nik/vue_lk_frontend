<template>
  <v-container fluid>
    <transition name="router-anim">
      <router-view></router-view>
    </transition>
  </v-container>
</template>

<script>

export default {
  name: 'Body'
}

</script>