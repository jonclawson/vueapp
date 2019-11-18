import Vue from "vue";
import Router from "vue-router";
import SignUp from "@/components/SignUp";
import Dashboard from "@/components/Dashboard";
import StoryEdit from "@/components/StoryEdit";
import StoryList from "@/components/StoryList";
import StoryView from "@/components/StoryView";
import { UserService } from '@/services/user.service'
Vue.use(Router);

 const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "SignUp",
      component: SignUp
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: Dashboard
    },
    {
      path: "/stories/create",
      name: "CreateStory",
      component: StoryEdit
    },
    {
      path: "/stories/:id",
      name: "StoryView",
      component: StoryView
    },
    {
      path: "/stories/update/:id",
      name: "UpdateStory",
      component: StoryEdit
    },
    {
      path: "/stories/",
      name: "StoryList",
      component: StoryList
    },
    { 
      path: '*', 
      redirect: '/' 
    }

  ]
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/'];
  const authRequired = !publicPages.includes(to.path);

  if (authRequired && !localStorage.getItem('user')) {
    localStorage.clear()
    return next({
      path: '/',
      query: { returnUrl: to.path } 
    })
  }
  return next()
})

export default router