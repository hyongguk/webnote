<template>
  <div class="note_container">
    <p></p>
    <!-- :value="cards[cardFocused].text" -->
    <textarea
      class="note_form"
      rows="20"
      ref="textareaObj"
      :value="this.cards[this.cardFocused].text"
      v-if="this.cards.length > 0 && this.cardFocused != null"
      @input="sendMessageToCardList"
    >
    </textarea>
  </div>
</template>
<script>
export default {
  name: "Note",
  props: ["cards", "cardFocused", "getInput", "updateDatabase"],
  data: () => ({
    text: ""
  }),
  methods: {
    sendMessageToCardList() {
      const valueOfTextarea = this.$refs.textareaObj.value;
      this.$emit("getInput", valueOfTextarea);
    }
  }
};
</script>
<style>
.note_form {
  height: 150%;
  width: 100%;
  background-color: transparent;
  border: 0 none;
  color: rgb(77, 75, 75);
  font-size: 16px;
}

.note_form:focus {
  outline: none;
}
.note_container {
  width: 80%;
}
</style>
