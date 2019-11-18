<template>
  <div class="container-fluid" style="padding: 0px;">
    <StoryList v-bind:favorites="true"/>
  </div>
</template>

<script>
import StoryList from "./StoryList";
export default {
  name: "Dashboard",
  components: {
    StoryList,
  },
  data() {
    return {
      title: "App",
      user : (this.$route.params.user) ? this.$route.params.user : null
    };
  },
  mounted(){
    this.user = JSON.parse(localStorage.getItem("user"));
  }
};
</script>
