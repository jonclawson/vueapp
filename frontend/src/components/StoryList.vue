<template>
  <div>
    <div class="container">
      <div class="tab-pane fade show active">
          <div class="row">
              <div class="col-md-12">
                <h3>
                  Stories
                  <router-link :to="{name: 'CreateStory'}" class="btn btn-sm btn-light">Create Story</router-link>
                </h3>
                <template v-for="story in stories">
                    <div v-bind:story="story">
                        <div >{{ story.title }}</div>
                        <div >{{ story.body}}</div>
                        <router-link :to="{ name: 'StoryView', params: { id: story.id }}" class="btn btn-success">Read More</router-link> 
                    </div>
                </template>
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
  name: "StoryList",
  props: ['favorites'],
  components: {},
  data() {
    return {
      stories: [],
      user: '',
    };
  },
  mounted() {
    this.user = UserService.getUser()
    StoryService.listStories().then(res => {
        if (res.data.status == true) {
          this.stories = res.data.stories.filter(s => this.favorites ? !!JSON.parse(s.favorite) : true) // sqlite limitations
        }
      });
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


.tab-pane {
  margin-top: 20px;
}
</style>
