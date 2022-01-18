const PORT = process.env.PORT || 2270; //--> port for Heroku
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

const newspapers = [
    {
        name: "indianexpress",
        address: "https://indianexpress.com/about/climate-change/",
        base: "",
    },
    {
        name: "firstpost",
        address: "https://www.firstpost.com/tag/climate-change",
        base: "",
    },
    {
        name: "TOI",
        address: "https://timesofindia.indiatimes.com/topic/climate-change",
        base: "",
    },
    {
        name: "ndtv",
        address: "https://www.ndtv.com/topic/climate-change-india",
        base: "",
    },
    {
        name: "thehindu",
        address: "https://www.thehindu.com/sci-tech/energy-and-environment/",
        base: "",
    },
    {
        name: "The Economics Times",
        address: "https://economictimes.indiatimes.com/topic/climate-change",
        base: "https://economictimes.indiatimes.com/",
    },
    {
        name: "down to earth",
        address: "https://www.downtoearth.org.in/climate-change",
        base: "",
    }
];

const articles = [];

newspapers.forEach((newspaper) => {
    axios
        .get(newspaper.address)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            const arr = $('a:contains("climate")', html); //-> ****

            for (let i = 0; i < arr.length; i++) {
                const title = $(arr[i]).text();
                const url = $(arr).attr("href");
                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get("/", (req, res) => {
    res.json("Welcome to my climate change response API");
});

app.get("/news", (req, res) => {
    res.json(articles);
});

app.get("/news/:newspaperID", (req, res) => {

    const newspaperID = req.params.newspaperID;

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name === newspaperID)[0].address;
    const newspaperBase = newspapers.filter(newspaper => newspaper.name === newspaperID)[0].base;

    axios
        .get(newspaperAddress)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            const arr = $('a:contains("climate")', html); //->****

            const specificArticle = [];

            for (let i = 0; i < arr.length; i++) {
                const title = $(arr[i]).text();
                const url = $(arr).attr("href");
                specificArticle.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperID
                });
            }

            res.json(specificArticle);
        })
        .catch((err) => {
            console.log(err);
        });
});

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
