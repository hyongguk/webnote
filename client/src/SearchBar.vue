<template>
  <!--<div id="container">-->
  <b-nav-form class="mr-auto" id="container">
    <b-icon-search id="icon_search" />
    <b-form-input
      id="search_bar"
      placeholder="   search"
      ref="inputObj"
      @keydown.enter="searchNotes"
      style="height: 1rem;"
    />
    <img
      class="cancel"
      src="./assets/cancel.svg"
      title="Flaticon"
      @click="cancelSearch"
    />
  </b-nav-form>
  <!--</div>-->
</template>
<script>
export default {
  name: "SearchBar",
  methods: {
    searchNotes: function() {
      const inputWords = this.$refs.inputObj.value;
      this.$emit("showSearchResults", inputWords);
    },
    cancelSearch() {
      this.$refs.inputObj.value = "";
      this.$emit("removeSearch");
    }
  }
};
</script>
<style>
#container {
  margin: 0 20px 0 auto !important;
  align-items: center;
  display: flex;
}
#search_bar {
  border-radius: 5px;
  width: 300px;
  height: 60%;
  border: none;
  font-size: 80%;
}
#icon_search {
  margin-right: 10px;
}
.cancel {
  width: 20px;
  height: 20px;
  margin-left: 5px;
}
</style>
