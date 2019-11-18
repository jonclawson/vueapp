import axios from "axios";

export const StoryService = {
    createStory(formData) {
    return axios.post(`http://localhost:3128/stories/`, formData, {
        headers: {"x-access-token": localStorage.getItem("token")}
        })
    },
    updateStory(id, formData) {
    return axios.put(`http://localhost:3128/stories/${id}`, formData, {
        headers: {"x-access-token": localStorage.getItem("token")}
        })
    },
    getStory(id) {
        return axios.get(`http://localhost:3128/stories/${id}`,
        { headers: {"x-access-token": localStorage.getItem("token")} }
      )
    },
    listStories() {
        return axios.get(`http://localhost:3128/stories/`,
          {
            headers: {"x-access-token": localStorage.getItem("token")}
          }
        )
    },

}