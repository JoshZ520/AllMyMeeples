const home = (req, res) => {
  res.render("index", {
    title: "All My Meeples"
  });
};

module.exports = { home };
