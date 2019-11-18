<template>
  <div>
    <div class="container">

    <ul class="nav nav-pills nav-fill mb-3" id="pills-tab" role="tablist">
        <li class="nav-item">
            <a v-on:click="setTab('login')" v-bind:class="{ active: tab === 'login' }" class="nav-link" id="pills-login-tab" data-toggle="pill" href="#pills-login" role="tab" aria-controls="pills-upload" aria-selected="true">Log in</a>
        </li>
        <li class="nav-item">
            <a v-on:click="setTab('register')" v-bind:class="{ active: tab === 'register' }" class="nav-link" id="pills-register-tab" data-toggle="pill" href="#pills-register" role="tab" aria-controls="pills-verify" aria-selected="false">Register</a>
        </li>
    </ul>

    <div class="tab-content" id="pills-tabContent">
        <div v-bind:class="{ 'active show': tab === 'login' }" class="tab-pane fade" id="pills-login" role="tabpanel" aria-labelledby="pills-login-tab">
            <div class="row">
                <div class="col-md-12">
                    <form @submit.prevent="login">
                        <div class="form-group">
                            <label for="">Email:</label>
                            <input type="email" required class="form-control" placeholder="Email" v-model="model.email">
                        </div>
                        
                        <div class="form-group">
                            <label for="">Password:</label>
                            <input type="password" required class="form-control" placeholder="Password" v-model="model.password">
                        </div>
                        
                        <div class="form-group">
                            <button class="btn btn-success btn-light btn-large" >Login</button>
                            {{ loading }}
                            {{ status }}
                        </div>
                    </form> 
                </div>
            </div>
        </div>
        <div v-bind:class="{ 'active show': tab === 'register' }" class="tab-pane fade" id="pills-register" role="tabpanel" aria-labelledby="pills-register-tab">
            <div class="row">
                <div class="col-md-12">
                    <form @submit.prevent="register">
                        <div class="form-group">
                            <label for="">Name:</label>
                            <input type="text" required class="form-control" placeholder="Name" v-model="model.name">
                        </div>

                        <div class="form-group">
                            <label for="">Email:</label>
                            <input type="email" required class="form-control" placeholder="Email" v-model="model.email">
                        </div>
                        
                        <div class="form-group">
                            <label for="">Company Name:</label>
                            <input type="text" required class="form-control" placeholder="eg Chris Tech" v-model="model.company_name">
                        </div>
                        <div class="form-group">
                            <label for="">Password:</label>
                            <input type="password" required class="form-control" placeholder="Enter Password" v-model="model.password">
                        </div>
                        <div class="form-group">
                            <label for="">Confirm Password:</label>
                            <input type="password" required class="form-control" placeholder="Confirm Passowrd" v-model="model.c_password">
                        </div>

                        <div class="form-group">
                            <button class="btn btn-primary" >Register</button>
                            {{ loading }}
                            {{ status }}
                        </div>
                    </form>
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import Header from './Header';
import axios from 'axios';
import { UserService } from '../services/user.service'
export default {
  name: 'SignUp',
  components: {
    Header
  },
  data() {
    const user = UserService.getUser()
    if (user && user.id) {
      this.$router.push({ name: 'Dashboard'})
    }
    return {
      tab: 'login',
      model: {
        name: '',
        email: '',
        password: '',
        c_password: '',
        company_name: ''
      },
      loading: '',
      status: '',
    };
  },
  methods: {
    setTab(tab) {
      this.tab = tab
    },
    validate() {
      if (this.model.password != this.model.c_password) {
        return false;
      }

      return true;
    },
    register() {
      const formData = new FormData();
      let valid = this.validate();
      if (valid) {
        formData.append('name', this.model.name);
        formData.append('email', this.model.email);
        formData.append('company_name', this.model.company_name);
        formData.append('password', this.model.password);

        this.loading = 'Registering you, please wait';
        UserService.register(formData).then(response => {
          this.loading = ''
          if (response.id) {
            this.$router.push({
              name: 'Dashboard'
            });
          }
          else {
            this.status = response
          }
        })
      } else {
        alert('Passwords do not match');
      }
    },
    login() {
      const formData = new FormData();
      formData.append('email', this.model.email);
      formData.append('password', this.model.password);

      this.loading = 'Signing in';
      UserService.login(formData).then(userRespnose => {
        this.loading = ''
        if (userRespnose.id) {
          this.$router.push({
            name: 'Dashboard'
          });
        }
        else {
          this.status = userRespnose
        }
      })
    }
  }
};
</script>

<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #426cb9;
}
.container {
  text-align: center;
}
</style>
