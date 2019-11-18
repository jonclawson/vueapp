import axios from "axios";


export const UserService = {
    user: undefined,
    getUser,
    login,
    logout,
    register
}

function getUser () {
    return this.user = JSON.parse(localStorage.getItem('user'))
}

function logout () {
    localStorage.clear()
    location.reload(true)
}
function login (formData) {
    return axios.post("http://localhost:3128/login", formData).then(res => {
        // this.loading = "";
        if (res.data.status == true) {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user))

            //   this.$router.push({
            //     name: "Dashboard"
            //   });
            return this.getUser()
        } else {
            //   this.status = res.data.message;
            return res.data.message
        }
      })
}

function register (formData) {
    return axios.post("http://localhost:3128/register", formData).then(res => {
        // Post a status message
        //   this.loading = "";
        if (res.data.status == true) {
            // store the data in localStorage
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user))
            // now send the user to the next route
            // this.$router.push({
            //   name: "Dashboard"
            // });
            return this.getUser()

        } else {
            // this.status = res.data.message;
            return res.data.message
        }
    });
}