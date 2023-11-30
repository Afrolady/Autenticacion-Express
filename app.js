const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
const port = 3000;
const dotenv = require("dotenv");

dotenv.config();

const secret = process.env.JWT_SECRET;

// Lista de tareas
const users = [
  { id: 1, name: "Carlos Perez", password: "12346" },
  { id: 2, name: "Natalia Rodriguez", password: "12347" },
  { id: 3, name: "Anthony Jones", password: "123468" },
];

app.use(express.json());

app.get("/ruta-protegida", (req, res) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return res.status(401).send({ error: "Authorization header missing" });
    }

    const [bearer, token] = authorizationHeader.split(" ");

    if (bearer !== "Bearer" || !token) {
      return res
        .status(401)
        .send({ error: "Invalid Authorization header format" });
    }

    const payload = jwt.verify(token, secret);

    if (Date.now() > payload.exp) {
      return res.status(401).send({ error: "Token expired" });
    }

    res.send("Ruta Protegida");
  } catch (error) {
    console.error(error);
    res.status(401).send({ error: error.message });
  }
});

app.post("/login", (req, res) => {
  const { name, password } = { name: "Carlos Perez", password: "12346" };
  const user = users.find(
    (user) => user.name === name && user.password === password
  );
  if (!user) {
    return res.status(401).send({ message: "credencial invalida" });
  }

  const token = jwt.sign(
    {
      name: user.name,
      password: user.password,
      exp: Date.now() + 60 * 2000,
    },
    secret
  );
  res.send({ token });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
