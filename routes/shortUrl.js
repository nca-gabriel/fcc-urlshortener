// THIS IS THE MOST DEVIOUS STUFF I'VE MADE ISTG - why is there no actual instructions in the page goodsir?

const router = require("express").Router();
const { URL } = require("url");
const dns = require("dns");

// In-memory storage
let urlStorage = [],
  idCounter = 1;

router.post("/shorturl", (req, res) => {
  const origUrl = req.body.url;

  let hostname;
  try {
    hostname = new URL(origUrl).hostname;
  } catch {
    return res.json({ error: "invalid url" });
  }

  dns.lookup(hostname, (err) => {
    if (err) return res.json({ error: "invalid url" });

    // Check if URL already exists in memory
    let existing = urlStorage.find((entry) => entry.original_url === origUrl);
    if (existing) return res.json(existing);

    // Create new short URL
    const shortUrlEntry = {
      original_url: origUrl,
      short_url: idCounter++,
    };

    urlStorage.push(shortUrlEntry);
    res.json(shortUrlEntry);
  });
});

router.get("/shorturl/:short_url", (req, res) => {
  const shortUrl = parseInt(req.params.short_url);
  const entry = urlStorage.find((e) => e.short_url === shortUrl);

  if (!entry) return res.json({ error: "No short URL found for given input" });

  res.redirect(entry.original_url);
});

module.exports = router;
