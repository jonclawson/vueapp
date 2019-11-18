<template>
    <div>
        <span class="hamburger" v-on:click="openNav">&#9776;</span>
        <div id="leftsidenav" class="sidenav">
          <div class="sidenav--inner">
            <p class="close-nav" v-on:click="closeNav"><em>&times;</em></p>

            <p><em>{{ name }} </em>
            <em> {{ company }} </em></p>

            <hr> 

            <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
              <span v-on:click="setActive('Dashboard')">
                <router-link :to="{ name: 'Dashboard'}" class="nav-link" v-bind:class="{active: active === 'Dashboard'}">
                Dashboard
                </router-link> 
              </span>
             
              <span v-on:click="setActive('StoryList')">
                <router-link :to="{ name: 'StoryList'}" class="nav-link" v-bind:class="{active: active === 'StoryList'}">
                Stories
                </router-link> 
              </span>

              <span v-on:click="setActive('CreateStory')">
                <router-link :to="{ name: 'CreateStory'}" class="nav-link" v-bind:class="{active: active === 'CreateStory'}">
                Create Story
                </router-link> 
              </span>
             
              <a v-on:click="logout" class="nav-link" v-bind:class="{active: active === 'logout'}">
                Log Out
              </a> 
            </div>

          </div>
        </div>
    </div>
</template>

<script>
import { UserService } from '@/services/user.service'
export default {
  name: 'SideNav',
  props: ['name', 'company'],
  data() {
    return {
      active: 'Dashboard',
    };
  },
  methods: {
    setActive(option) {
      this.active = option;
    },
    openNav() {
      document.getElementById('leftsidenav').style.width = '20%';
      document.getElementById('main').style['padding-left'] = '20%';
    },
    closeNav() {
      document.getElementById('leftsidenav').style.width = '0%';
      document.getElementById('main').style['padding-left'] = '0%';

    },
    logout() {
      this.setActive('logout')
      UserService.logout()
    }
  },
  mounted() {
    this.openNav()
    this.active = this._routerRoot._route.name || ''
  }
};
</script>

<style>

.hamburger {
  font-size:30px;
  cursor:pointer
}
.close-nav {
  cursor: pointer;
  font-size: 24px;
}
.sidenav {
  height: 100%;
  width: 0;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: #fafafa;
  color: #818181;
  overflow-x: hidden;
  transition: 0.5s;
  text-align: left;

}

.sidenav--inner {
    padding: 8px 8px 8px 16px;
}

.sidenav a {
  text-decoration: none;
  font-size: 14px;
  color: #818181;
  display: block;
  transition: 0.3s;
}

.sidenav a:hover {
  color: #f1f1f1;
  background-color: #007bff7e
}

.sidenav .closebtn {
  position: absolute;
  top: 0;
  right: 25px;
  font-size: 36px;
  margin-left: 50px;
}

@media screen and (max-height: 450px) {
  .sidenav {
    padding-top: 15px;
  }
  .sidenav a {
    font-size: 18px;
  }
}

.clickable {
  cursor: pointer;
}
</style>

