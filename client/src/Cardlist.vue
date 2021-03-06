<template>
  <div class="parent">
    <b-navbar toggleable="lg" type="danger" variant="info">
      <b-navbar-brand>Webnote</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-button id="account" class="account_button">
            <img class="account_image" src="./assets/account.svg" />
          </b-button>
          <b-popover target="account" triggers="click" placement="bottom">
            <option class="logout" @click="logout">log out</option>
          </b-popover>
          <b-button class="edit_button" @click="addNewCard" size="sm">
            <img class="edit_image" src="./assets/edit.svg" />
          </b-button>
          <b-button class="delete_button" @click="deleteNote">
            <img class="delete_image" src="./assets/trash.svg" />
          </b-button>
        </b-navbar-nav>
        <b-navbar-nav> </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <SearchBar
            @showSearchResults="showSearchResults"
            @removeSearch="removeSearch"
          />
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
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
  props: ["user_id", "getUserId"],
  beforeMount() {
    this.getNotes();
  },
  methods: {
    //get all the notes of a user logging in
    async getNotes() {
      await axios
        .get("/api/notes/", {})
        .then(response => {
          if (response.data.isAuthenticated === false) {
            this.$router.push("/login");
          } else {
            response.data.notes.forEach(obj => {
              this.cards.push({
                id: obj.id,
                title: obj.title,
                text: obj.body,
                time: new Date(obj.update_at),
                isSaved: true
              });
            });
          }
          this.currentUser = response.data.user_id;
        })
        .catch(err => alert(err));
    },

    //send log out request to server
    async logout() {
      axios.get("/api/logout").then(() => {
        this.$router.push("/login");
      });
    },
    //serchBarでから受けとたvalueを元に検索結果を表示する
    async showSearchResults(inputValue) {
      this.searchWord = inputValue;
      this.cards = [];
      await axios
        .get("/api/notes/search", {
          params: { keyword: this.searchWord }
        })
        .then(res => {
          res.data.forEach(obj => {
            this.cards.push({
              id: obj.id,
              title: obj.title,
              text: obj.body,
              time: new Date(obj.update_at),
              isSaved: true
            });
          });
        })
        .catch(() => {});
    },
    //remove searched results and display all notes of the user
    removeSearch() {
      this.cards = [];
      this.getNotes();
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
        .then(response => {
          this.cards[0].id = response.data;
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
      let month = date.getMonth() + 1;
      let day = date.getDate();
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
    searchWord: "",
    currentUser: null,
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
  background: rgba(158, 226, 235, 0.644) !important;
}
.nav {
  width: 100%;
  height: 40px;
  background: linear-gradient(rgb(236, 228, 228) 0%, rgb(204, 202, 202) 100%);
  padding-left: 100px;
}
.account_button {
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

.account_image {
  width: 100%;
  height: 100%;
  display: block;
  margin-top: auto;
  margin-bottom: auto;
}

.logout {
  cursor: pointer;
}
.edit_button {
  background-color: white !important;
  height: 30px;
  width: 50px;
  border: 1px solid rgb(201, 197, 197) !important;
  position: relative;
  left: 20px !important;
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
  left: 30px;
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
  height: 90%;
  max-width: 100% !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.nav-search {
  margin-right: 0;
  padding-right: 0;
}

#col1 {
  height: 100%;
  border-right: 1px 1px solid rgb(228, 223, 223);
  padding: 0;
  background-color: rgba(161, 157, 144, 0.199);
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
