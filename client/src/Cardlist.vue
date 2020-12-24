<template>
  <div class="parent">
    <div class="nav">
      <b-button class="edit_button" @click="addNewCard" size="sm">
        <img class="edit_image" src="./assets/edit.svg" />
      </b-button>
      <b-button class="delete_button" @click="deleteNote">
        <img class="delete_image" src="./assets/trash.svg" />
      </b-button>
      <SearchBar @showSearchResults="showSearchResults" />
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
              <div class="box">
                <p class="timestamp">{{ showDate(card.time) }}</p>
                <img
                  v-if="card.isSaved"
                  class="saved"
                  src="./assets/PinClipart.com_report-clipart_2051127.png"
                />
                <img v-else class="loading" src="./assets/loader.gif" />
              </div>
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
import SearchBar from "./SearchBar";
const axios = require("axios");

export default {
  name: "Cardlist",
  components: {
    Note,
    SearchBar
  },
  beforeMount: async function() {
    await axios.get("/api/notes").then(response => {
      response.data.forEach(obj => {
        this.cards.push({
          id: obj.id,
          title: obj.title,
          text: obj.body,
          time: new Date(obj.update_at),
          isSaved: true
        });
      });
    });
  },
  // computed: {
  //   filterdCards: function () {
  //     this.cardFocused = 0;
  //     console.log("in filterCards func: searchWord is ", this.searchWord, " and isSearching is ", this.isSearching)
  //     let indexArr =[]
  //     const self = this;
  //     if (this.isSearching) {
  //       const arr = this.cards.filter(function (card, index){
  //         if(card.text.includes(self.searchWord)){
  //           console.log("インデックスは",index)
  //           indexArr.push(index);
  //           return card;
  //         }
  //       });
  //       if (arr == 0){
  //         self.cardFocused = null;
  //       } else {
  //         console.log(indexArr)
  //         self.cardFocused = indexArr[0];
  //         return arr;
  //       }
  //     } else {
  //       return this.cards;
  //     }
  //   },
  // },
  methods: {
    //serchBarでから受けとたvalueを元に検索結果を表示する
    showSearchResults(inputValue) {
      this.isSearching = true;
      this.searchWord = inputValue;
      console.log(
        "🚀 ~ file: Cardlist.vue ~ line 86 ~ showSearchResults ~ searchWord",
        this.searchWord
      );
    },
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
    async addNewCard() {
      const date = new Date();
      //post to database
      this.cards.unshift({
        title: "",
        text: "",
        time: date,
        isSaved: true,
        user_id: this.currentUser
      });
      this.chooseCard(0);
      await axios
        .post("/api/notes/", {
          title: "",
          body: "",
          update_at: date,
          user_id: this.currentUser
        })
        .then(respose => {
          this.cards[0].id = respose.data;
        });
    },

    changeTitle(input) {
      let arr = input.split("\n");
      let firstLine = arr[0];
      this.cards[this.cardFocused].title = firstLine;
    },
    getInput(input) {
      this.cards[this.cardFocused].isSaved = false;
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
      const self = this;
      this.timeoutId = setTimeout(async function() {
        await axios
          .put("/api/notes/" + id, {
            id: id,
            title: title,
            body: body,
            update_at: date
          })
          .then(() => {
            self.cards[self.cardFocused].isSaved = true;
          });
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
    async deleteNote() {
      //get note id to delete
      const idToDelete = this.cards[this.cardFocused].id;
      this.cards.splice(this.cardFocused, 1);
      await axios.delete("/api/notes/" + idToDelete);
    },
    sortlists() {
      this.cards.sort((a, b) => {
        return b.time - a.time;
      });
    }
  },
  data: () => ({
    isSearching: false,
    searchWord: "",
    currentUser: 7,
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
  box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
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
  width: 110%;
  height: 110%;
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
  border-right: 1px solid rgb(228, 223, 223);
  padding: 0;
}
.textbox-title {
  margin-left: 10%;
}
.titles {
  border-bottom: 1px solid rgb(228, 223, 223);
  display: flex;
  flex-direction: column;
}
.title_line {
  margin-top: 1rem;
  margin-bottom: 0;
  font-weight: 600;
  color: rgb(78, 76, 76);
  font-size: 14px;
}

.untitled_line {
  margin-top: 1rem;
  margin-bottom: 0;
  font-weight: 900;
  color: rgba(128, 128, 128, 0.623);
}
.box {
  display: flex;
  justify-content: space-between;
}
.loading {
  width: 12%;
  height: 50%;
  padding-right: 20px;
}
.saved {
  width: 10%;
  height: 40%;
  padding-right: 20px !important;
}

.timestamp {
  color: rgb(151, 146, 146);
  font-size: 15px;
}

#col2 {
  flex: 60%;
}
</style>
