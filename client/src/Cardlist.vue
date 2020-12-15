<template>
  <div class="parent">
    <div class="nav">
      <b-button class="edit_button" @click="addNewCard" size="sm">
        <img class="edit_image" src="./assets/icons8-edit-50.png" />
      </b-button>
      <b-button class="delete_button" @click="deleteNote">
        <img class="delete_image" src="./assets/garbage-icon.png" />
      </b-button>
    </div>
    <div class="container">
      <div class="col" id="col1">
        <div>
          <div
            class="titles"
            v-for="(card, index) in cards"
            v-bind:key="card.id"
            @click="chooseCard(index)"
            v-bind:class="[cardFocused == index ? 'changed-color' : '']"
          >
            <div class="textbox-title">
              <p
                class="title_line"
                v-bind:class="[
                  card.title.length === 0 ? 'untitled_line' : 'title_line'
                ]"
              >
                {{ showTitle(card.title) }}
              </p>
              <p class="timestamp">{{ showDate(card.time) }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="col" id="col2">
        <div class="child2">
          <Note
            v-bind:cards="cards"
            v-bind:cardFocused="cardFocused"
            @getInput="getInput"
            @delete-note="deleteNote"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Note from "./Note";
const axios = require("axios");

export default {
  name: "Cardlist",
  components: {
    Note
  },
  beforeMount: async function() {
    await axios.get("/api").then(response => {
      response.data.forEach(obj => {
        this.cards.push({
          id: obj.id,
          title: obj.title,
          text: obj.body,
          time: new Date(obj.update_at)
        });
      });
    });
  },
  methods: {
    //タイトルを表示する
    showTitle(value) {
      if (value === "") {
        return "Untitled";
      } else {
        return value;
      }
    },
    chooseCard(value) {
      this.cardFocused = value;
    },
    addNewCard() {
      this.cards.unshift({ title: "", text: "", time: new Date() });
      this.chooseCard(0);
    },

    changeTitle(input) {
      let arr = input.split("\n");
      let firstLine = arr[0];
      this.cards[this.cardFocused].title = firstLine;
    },
    getInput(input) {
      console.log("input in getInput: ", input);
      this.changeTitle(input);
      this.cards[this.cardFocused].text = input;
      let date = new Date();
      this.cards[this.cardFocused].time = date;
      this.$set(this.cards, this.cardFocused, this.cards[this.cardFocused]);
      this.sortlists();
      this.cardFocused = 0;
      //update database
      clearTimeout(this.timeoutId);
      //入力して２秒後にサーバーに情報を送る
      let arr = input.split("\n");
      const title = arr[0];
      const body = input;
      const id = this.cards[this.cardFocused].id;
      console.log(typeof id, id);
      this.timeoutId = setTimeout(async function() {
        console.log("in settimeOUt");
        await axios
          .put("/api/notes/" + id, {
            id: id,
            title: title,
            body: body,
            update_at: date
          })
          .then(response => console.log(response));
        // let response = await fetch('/api')
        //   .then(response => response.json())
        //   .then(data => console.log(data))
      }, 2000);
    },
    showDate(date) {
      let year = date.getFullYear();
      let month = date.getMonth();
      let day = date.getDay();
      let time = date.getHours();
      let minute = date.getMinutes();
      let second = date.getSeconds();
      return (
        year +
        "/" +
        month +
        "/" +
        day +
        "  " +
        time +
        ":" +
        minute +
        ":" +
        second
      );
    },
    deleteNote() {
      console.log("ケバブ");
      this.cards.splice(this.cardFocused, 1);
    },
    sortlists() {
      this.cards.sort((a, b) => {
        return b.time - a.time;
      });
    }
  },
  data: () => ({
    cardFocused: 0,
    cards: [],
    timeoutId: ""
  })
};
</script>
<style>
.parent {
  padding: 0px;
  margin: 0px;
  height: 100%;
  width: 100%;
}
.changed-color {
  background: rgba(248, 206, 16, 0.644) !important;
}
.nav {
  width: 100%;
  height: 40px;
  background: linear-gradient(rgb(236, 228, 228) 0%, rgb(204, 202, 202) 100%);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  padding-left: 100px;
}
.edit_button {
  background-color: white !important;
  height: 30px;
  width: 50px;
  border: 1px solid rgb(201, 197, 197) !important;
  position: relative;
  left: 10px !important;
  margin-top: auto;
  margin-bottom: auto;
  box-shadow: 0 0２px 0２px 0 rgb(66, 65, 65);
}
.edit_image {
  width: 100%;
  height: 100%;
  display: block;
  margin-top: auto;
  margin-bottom: auto;
}
.delete_button {
  background-color: white !important;
  height: 30px;
  width: 50px;
  border: 1px solid rgb(201, 197, 197) !important;
  position: relative;
  left: 20px;
  margin-top: auto;
  margin-bottom: auto;
  box-shadow: 0 0２px 0２px 0 rgb(66, 65, 65);
}
.delete_image {
  width: 100%;
  height: 100%;
  display: block;
  margin-top: auto;
  margin-bottom: auto;
  margin-left: auto;
  margin-right: auto;
}

.container {
  display: inline-flex;
  height: 100%;
  max-width: 100% !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}
#col1 {
  height: 100%;
  border-right: 1px solid rgb(219, 218, 218);
  padding: 0;
}
.textbox-title {
  margin-left: 10%;
}
.titles {
  border-bottom: 1px solid rgb(219, 218, 218);
  display: flex;
  flex-direction: column;
}
.title_line {
  margin-top: 1rem;
  margin-bottom: 0;
  font-weight: 600;
  color: rgb(78, 76, 76);
}

.untitled_line {
  margin-top: 1rem;
  margin-bottom: 0;
  font-weight: 900;
  color: rgba(128, 128, 128, 0.623);
}

.timestamp {
  color: rgb(151, 146, 146);
  font-size: 15px;
}

#col2 {
  flex: 60%;
}
</style>
