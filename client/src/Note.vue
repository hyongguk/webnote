<template>
  <div class="note_container">
    <p></p>
    <!-- :value="cards[cardFocused].text" -->
    <textarea
      class="note_form"
      rows="20"
      ref="textareaObj"
      :value="this.cards[this.cardFocused].text"
      @input="sendMessage"
    >
    </textarea>
  </div>
</template>
<script>
export default {
  name: "Note",
  props: ["cards", "cardFocused", "getInput"],
  data: () => ({
    text: ""
  }),
  methods: {
    sendMessage() {
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
}

.note_form:focus {
  outline: none;
}
.note_container {
  width: 80%;
}
</style>
