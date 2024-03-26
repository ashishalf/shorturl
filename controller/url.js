const shortid = require("shortid");
const URL = require("../model/url");

async function createNewUrl(req, res) {
  const body = req.body;
  if (!body.url) {
    return res.status(400).json({ error: "URL is required." });
  }
  const shortId = shortid();
  await URL.create({
    shortID: shortId,
    redirectURL: body.url,
    viewHistory: [],
    createdBy: req.user._id,
  });

  return res.render("home", {
    id: shortId,
  });
  // return res.json({ id: shortId });
}

async function redirectUrl(req, res) {
  const shortID = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortID,
    },
    {
      $push: {
        viewHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  if (!entry) {
    return res.status(404).send("URL not found");
  }
  res.redirect(entry.redirectURL);
}

async function getAnalytics(req, res) {
  const shortID = req.params.shortId;
  const result = await URL.findOne({
    shortID,
  });
  return res.json({
    TotalClicks: result.viewHistory.length,
    Analytics: result.viewHistory,
  });
}

module.exports = { createNewUrl, redirectUrl, getAnalytics };
