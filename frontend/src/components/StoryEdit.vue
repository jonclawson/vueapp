<template>
  <div>
    <div class="container">
      <div class="tab-pane fade show active">
          <div class="row">
              <div class="col-md-12">
                  <h3>Create Story</h3>
                  <form @submit.prevent="onSubmit">

                    <div class="form-group">
                        <label for="">Story Title:</label>
                        <input type="text" required class="form-control" placeholder="Title" v-model="story.title">
                    </div>

                    <div class="form-group">
                      <label for="">Story:</label>
                      <textarea required class="form-control" placeholder="Body" v-model="story.body"></textarea>
                    </div>

                    <div class="form-group">
                      <label >
                          Post on Dashboard
                        <input type="checkbox" v-model="story.favorite"/>
                      </label>
                    </div>
                    
                    <div class="form-group">
                        <button class="btn btn-primary" >Save</button>
                        {{ loading }}
                        {{ status }}
                        <router-link class="btn btn-light" :to="{ name: 'StoryView', params: {id: story.id}}" v-if="story.id">View</router-link>
                    </div>

                  </form> 
              </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import { UserService } from '@/services/user.service'
import { StoryService } from '@/services/story.service'
export default {
  name: "StoryEdit",
  components: {},
  beforeRouteEnter(to, from, next) {
    if (to.params.id !== undefined) {
      return StoryService.getStory(to.params.id).then(res => {
          if (res.data.status == true) {
            const story = res.data.story
            story.favorite = JSON.parse(story.favorite)
            return next(c => c.story = story)
          }
        })
    }
    else {
      return next()
    }
  },
  data() {
    return {
      story: {
        title: "",
        body: "",
        favorite: false
      },
      loading: "",
      status: ""
    };
  },
  methods: {
    onSubmit() {
      const formData = new FormData();
      // format for request

      formData.append("title", this.story.title);
      formData.append("body", this.story.body);
      formData.append("favorite", !!this.story.favorite);
      let user = UserService.getUser()
      formData.append("user_id", user.id);

      this.loading = "Saving, please wait ...";
      let request
      if (this.story.id) {
        request = StoryService.updateStory(this.story.id, formData)
      }
      else {
        request = StoryService.createStory(formData)
      }
      request.then(response => {
        this.loading = "";
        if (response.data.status == true) {
          this.status = response.data.message;
        } else {
          this.status = response.data.message;
        }       
      })
      // Post to server
      // const method = this.story.id ? axios.put : axios.post
      // const id = this.story.id || ''
      // method(`http://localhost:3128/stories/${id}`, formData, {
      //   headers: {"x-access-token": localStorage.getItem("token")}
      // }).then(res => {
      //   // Post a status message
      //   this.loading = "";
      //   if (res.data.status == true) {
      //     this.status = res.data.message;
      //   } else {
      //     this.status = res.data.message;
      //   }
      // });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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

.tab-pane {
  margin-top: 20px;
}
</style>
