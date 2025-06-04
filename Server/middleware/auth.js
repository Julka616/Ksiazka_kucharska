const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  console.log("Headers:", req.headers);  // log wszystkich nagłówków

  const authHeader = req.header("authorization"); // małymi literami - OK, Express normalizuje nagłówki
  console.log("authHeader:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ msg: "Brak tokenu, odmowa dostępu" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Token extracted:", token);

  if (!token) {
    return res.status(401).json({ msg: "Token jest nieprawidłowy" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("Token verification error:", err.message);
    res.status(401).json({ msg: "Token jest nieprawidłowy" });
  }
}

module.exports = auth;
