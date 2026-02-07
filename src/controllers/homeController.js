const home = (req, res) => {
  res.render("index", {
    title: "All My Meeples",
    message: "Welcome to your MVC starter."
  });
};

module.exports = { home };
