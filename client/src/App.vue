<template>
  <div
    class="background"
    :style="{
      //'background-image':
      //'url(https://images.unsplash.com/photo-1601662528567-526cd06f6582?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1858&q=80)'
    }"
  >
    <!--<Login
      v-if="user_id == ''"
      v-bind:user_id="user_id"
      @getUserId="getUserId"
    />-->
    <!--<Cardlist v-else v-bind:user_id="user_id" />-->
    <router-view v-bind:user_id="user_id" @getUserId="getUserId" />
  </div>
</template>
<script>
// import Cardlist from "./Cardlist.vue";
// import Login from "./Login";
export default {
  components: {},
  name: "App",
  data: () => ({
    user_id: "",
    password: ""
  }),
  // mounted: function() {
  //   console.log("looking");
  //   const email = localStorage.getItem("adress");
  //   const pwd = localStorage.getItem("password");
  //   console.log("保存されているemailは   ", email);
  //   console.log("保存されているpassは   ", pwd);
  //   this.user_id = email;
  //   this.password = pwd;
  //   //TODO:以下を直す
  //   if (email != null && pwd != null) {
  //     console.log('in /notes redirection')
  //     this.$router.push("/notes").catch(() => {});
  //   } else {
  //     console.log("ここにきた")
  //     this.$router.push("/login").catch(() => {});
  //   }
  // },

  methods: {
    getUserId(value) {
      this.user_id = value;
      console.log("value は", this.user_id);
    }
  }
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat&display=swap");

* {
  margin: 0px;
  padding: 0px;
}
.background {
  background: rgb(47, 52, 82);
  padding: 0px;
  height: 100%;
  font-family: Helvetica, Arial, sans-serif;
}
html {
  height: 100%;
}
body {
  height: 100%;
}
</style>
