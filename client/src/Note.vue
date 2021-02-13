<template>
  <div class="note_container">
    <textarea
      class="note_form"
      rows="40"
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
    text: "",
    isEditing: false
  }),
  updated() {
    if (this.cards.length != 0) {
      this.focusToTextarea();
    }
  },
  methods: {
    sendMessageToCardList() {
      const valueOfTextarea = this.$refs.textareaObj.value;
      this.$emit("getInput", valueOfTextarea);
    },
    focusToTextarea() {
      this.$nextTick(function() {
        this.$refs.textareaObj.focus();
      });
      //this.$refs.textareaObj.focus();
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
  color: rgb(41, 39, 39);
  font-size: 16px;
  margin-top: 3%;
  margin-left: 10%;
}

.note_form:focus {
  outline: none;
}
.note_container {
  width: 80%;
}
</style>
