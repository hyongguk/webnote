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
          user_id: 1,
          title: "title1",
          body: "title1\nbody1",
          update_at: "2017-04-20 19:33:56.774+03"
        },
        {
          user_id: 1,
          title: "title2",
          body: "title2\nbody2",
          update_at: "2017-04-20 19:33:56.774+03"
        },
        {
          user_id: 1,
          title: "title3",
          body: "title3\nbody3",
          update_at: "2017-04-20 19:33:56.774+03"
        }
      ]);
    });
};
