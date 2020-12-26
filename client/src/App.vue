<template>
  <div
    class="background"
    :style="{
      'background-image':
        'url(https://images.unsplash.com/photo-1601662528567-526cd06f6582?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1858&q=80)'
    }"
  >
    <router-view />
  </div>
</template>
<script>
export default {
  name: "App",

  beforeMount: function() {
    const email = localStorage.getItem("adress");
    const pwd = localStorage.getItem("password");
    if (email != undefined && pwd != undefined) {
      this.$router.push("/").catch(() => {});
    } else {
      this.$router.push("/login").catch(() => {});
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
  background: rgb(247, 242, 202);
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
