// Loads the express module
const express = require("express");
const hbs = require("hbs");

const bodyParser = require("body-parser");

const path = require("path");

//Creates our express server
const app = express();
const port = 3000;

//Serves static files (we need it to import a css file)
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "hbs");
app.use(bodyParser.urlencoded({ extended: true }));

//Sets a basic route

// Render the initial page with the number input form
app.get("/", (req, res) => {
  res.render("index");
});

// Create express route binder for draw.hbs and get the data from the url as parameters
// that came from index.hbs

app.get("/happy", (req, res) => {
  const input = req.query;
  console.log(input);
  let name = input.name;
  let gender = input.gender;
  let num = input.number;
  
  let guests = [];
  let here = []; 
  
  for (let i = 1; i <= num; i++) {
    let guestName = input[`name${i}`];
    guests.push(guestName);
    if (input[`checkbox${i}`] === "on") {
      here.push(guestName);
    }
  }
  
  let list = `Celebrant: ${name}\nGender: ${gender}<br>Invited Guests:<br>`;
  guests.forEach((guest) => {
    list += `${guest}: ${here.includes(guest) ? "Attended" : "Did Not Attend"}<br>`;
  });

  const happyBirthday = `Happy birthday to you. Happy birthday to you. 
  Happy birthday dear ${name}. Happy birthday to you!`.split(' ');

  const pronoun = gender === "male" ? "he's" : "she's";
  const goodFellowSong = `For ${pronoun} a jolly good fellow. For ${pronoun} a jolly good fellow. 
  For ${pronoun} a jolly good fellow, which nobody can deny!`;

  let song = [];

  if (here.length > 0) {
    const totalWords = Math.ceil(here.length / happyBirthday.length) * happyBirthday.length;
    for (let i = 0; i < totalWords; i++) {
      song.push(`${here[i % here.length]}: ${happyBirthday[i % happyBirthday.length]}`);
    } 
    let lastSingerIndex = (totalWords - 1) % here.length;
    let nextSingerIndex = (lastSingerIndex + 1) % here.length;
    song.push(`${here[nextSingerIndex]}: ${goodFellowSong}`);
  } else {
    // Makes it so that if no guests attended, then everyone sings together
    song.push(`Everyone: ${happyBirthday.join(' ')}`);
    song.push(`Everyone: ${goodFellowSong}`);
  }

  res.render("happy", { list, song });
});

//Makes the app listen to port 3000
app.listen(port, () => console.log(`App listening to port ${port}`));
