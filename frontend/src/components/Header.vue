<template>
    <nav class="navbar navbar-light bg-light">
        <template v-if="UserService.user != null">
            <SideNav v-bind:name="UserService.user.name" v-bind:company="UserService.user.company_name"/>
        </template>
        <span class="navbar-brand mb-0 h1">
          <img src="/static/logo.png" class="logo"/>
          {{title}}
          </span>
    </nav>
</template>

<script>
import SideNav from './SideNav'
import { UserService } from '../services/user.service'
export default {
  name: "Header",
  components: {
    SideNav
  },
  data() {
    return {
      title: "App",
      UserService
    };
  },
  methods: {

  }
};
</script>
<style scoped>
  .logo {
    width: 30px;
    height: 30px;
  }
</style>