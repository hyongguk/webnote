<template>
  <div class="background">
    <router-view />
  </div>
</template>
<script>
const axios = require("axios");

export default {
  components: {},
  name: "App",

  mounted: async function() {
    console.log("今日わ");
    await axios.get("/api/auth", {}).then(response => {
      if (response.data.isAuthenticated) {
        this.$router.push("/notes");
      } else {
        console.log("come here in 31 nile");
        this.$router.push("/login").catch(() => {});
      }
    });
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
