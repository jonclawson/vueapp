<template>
  <div>
    <div class="container">
      <div class="tab-pane fade show active">
          <div class="row">
              <div class="col-md-12">
                <div >
                    {{story.title}} 
                    <router-link :to="{ name: 'UpdateStory', params: { id: story.id }}" class="btn btn-sm btn-light">Edit</router-link> 
                </div>

                <div >
                {{story.body}}
                </div>

                <div >
                    {{ loading }}
                    {{ status }}
                </div>
              </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import { StoryService } from '@/services/story.service'

export default {
  name: "StoryEdit",
  components: {},
  beforeRouteEnter(to, from, next) {
    if (to.params.id !== undefined) {
      return StoryService.getStory(to.params.id).then(res => {
          if (res.data.status == true) {
            return next(s => s.story = res.data.story)
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
        body: ""
      },
      loading: "",
      status: ""
    };
  },
  methods: {
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
