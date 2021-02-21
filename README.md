[日本語](README.md)

# 📒webnote
An web Applicabion to take note, which you can use on a browser. 
every single change is stored in database automatically and you can check if saving is done.
notes are sorted by time whe you update a note. If you create a lot of notes and have no idea where a specific note is, a search bar is available.



<br/>
<br/>
<br/>
<br/>
<h2>🤼‍Dependencies<h2/>

axios: 0.21.0<br/>
bcrypt: 5.0<br/>
bcrypt: 5.0.0<br/>
bootstrap: 4.5.2<br/>
bootstrap-vue: 2.17.3<br/>
connect-flash: 0.1.1<br/>
cookie-parser": 1.4.5<br/>
cookie-session: 1.4.0<br/>
core-js: 3.6.4<br/>
cors: 2.8.5<br/>
dotenv: 8.2.0<br/>
eslint: 7.9.0<br/>
express: 4.16.3<br/>
express-flash: 0.0.2<br/>
express-session: 1.17.1<br/>
knex: 0.21.0<br/>
moment: 2.22.2<br/>
morgan: 1.9.0<br/>
passport: 0.4.1<br/>
passport-local: 1.0.0<br/>
pg: 8.0.2<br/>
vue: 2.6.12<br/>
vue-axios: 3.2.0<br/>
vue-router: 3.4.9<br/>

<br/>
<br/>
<br/>

<h2>🔥DEMO</h2>

<img src="./assets/ノート作成.gif"/>
<br/>
<img src="./assets/自動保存.gif" />
<br/>
<img src="./assets/自動ソート.gif" />

<br/>
<br/>
<br/>
<h2>🚀How It Works</h2>

#### Sign UP / Sign In

Date inputted in sign-up or sign-in form is sent synchronously to a server And then the server gets the request and authorize the user using Local Strategy of Passport library. When it comes to sign up, the server verifies if the same user data is in a database and if not,  it hashes password using bcrypt and stores it with email adress into database. In case of sign in, the server autorizes a user based on data which is resisterd when the user signs up. Onece authorization is done, session starts and the server authorizes every request from a client side based on the session data for certain period of time.

<br/>
<br/>
<br/>

#### List All Notes

If authorization succeeds, an user is redirected to a home page and a browser sends a GET request to a server using a Lifecycle hook. the server extracts data of the user autorized and sorts it by time when the user updated a note. Then, a server sends a response with the data of all the notes and a browser store the data as an array regarding notes into properties of data class in Vue in order to watch the changes of notes. A browser render lists of titles with time updated.
<br/>
<br/>
<br/>

#### Editing a Note

when you choose a title card on the left of a browser, the the title card's going to be highlighted and the detail of the note is going to be displayed on the right side of a browser. A note's detail component is binded to the notes list so a title inputed on the note on the right side is going to be reflected on the tile card on the cards list. When a brower notices an input on a note, the last update time's going to be update and then the title cards list is going to be sorted.
<br/>
<br/>
<br/>

#### auto save

Every time an input is noticed, a browser excutes a function to send a PUT request to reflect a change into database. However, when you input a letter in a row for sort time, a PUT request is postponed in 2 seconds. In other words, a browser sends a PUT request to a server as logn as no input is detected for 2 seconds since the last input.
<br/>
<br/>
<br/>

#### adding a new note and deletign a note

When you click a delete button, data regarding a note selected is removed from the property of Vue data class and a DELETE request is sent to a server.
Clicking a add button leads creating a new object in properties of Vue data class and sending a POST request. A server creates a new row in a note table of database
<br/>
<br/>
<br/>

#### Search

When you input keywords in the search bar, a browser orders the server to extract all the notes including the keywords from database and displays them as a notes list
<br/>
<br/>
<br/>
<br/>
<h2>Tech Stack</h2>

### frontend
* javascritpt
* Vue.js
* Vue.router
* Vue-Bootstrap

### backend
* Node.js
* passport.js
* knex
* Express
* PostgreSQL

