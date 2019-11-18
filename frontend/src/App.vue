<template>
  <div id="app">
    <Header  />
    <div id="main">
      <router-view/>
    </div>
  </div>
</template>

<script>
import Header from "./components/Header";
import { UserService } from '@/services/user.service'
export default {
  name: 'App',
  components: { Header },
  data () {
    const user = UserService.getUser()
    return {
      user :  user || null
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
