exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("users").insert([
        { email_adress: "hyongguk1984@gmail.com", password: "lion" },
        { email_adress: "hong2053@icloud.com", password: "rabit" },
        { email_adress: "hhhhhhh@gmail.com", password: "gorira" }
      ]);
    })
    .then(function() {
      return knex("notes").insert([
        {
          user_id: 6,
          title: "titile1",
          body: "text1",
          update_at: "2017-04-20 19:33:56.774+03"
        },
        {
          user_id: 6,
          title: "titile2",
          body: "text2",
          update_at: "2017-04-20 19:33:56.774+03"
        },
        {
          user_id: 6,
          title: "titile3",
          body: "text2",
          update_at: "2017-04-20 19:33:56.774+03"
        }
      ]);
    });
};
