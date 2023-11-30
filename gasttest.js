let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let fs = require("fs");

app.use(bodyParser.urlencoded({ extended: true }));
// Läser data som finns från users.json
let users = [];
try {
  let data = fs.readFileSync("users.json", "utf8");
  if (data) {
    users = JSON.parse(data);
  }
} catch (err) {
  console.error("Fel vid läsning av filen:", err);
}

app.post("/submit-form", (req, res) => {
  let { name, email, phone, comment } = req.body;
  users.push({ name, email, phone, comment });

  // Skriver gäst info till users.json file
  fs.writeFile("users.json", JSON.stringify(users), (err) => {
    if (err) {
      console.error("Error writing to the file:", err);
      return res.status(500).send("Server error");
    }
    res.redirect("/");
  });
});

// Min html form
app.get("/", (req, res) => {
    let output = "";
    if (users && users.length > 0) {
      for (let i = 0; i < users.length; i++) {
        output += `<p><br>
        Name: ${users[i].name}<br> 
        Email: ${users[i].email}  <br/>
        Phone: ${users[i].phone}  <br/>
        Comment: ${users[i].comment}</p>`;
      }
    }
    let html = fs.readFileSync(__dirname + "/gasttest.html").toString();
    html = html.replace("GUEST", output);
    res.send(html);
  });

  

// För att visa alla användare
app.get("/users", (req, res) => {
  res.json(users);
});

// Servern körs i 3000
let PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});