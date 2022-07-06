const puppeteer = require("puppeteer");
var now = require("performance-now");
const Product = require("../../models/Product.model");

module.exports = async (ingredients) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://supermercado.eroski.es", {
    waitUntil: "domcontentloaded",
  });
  console.log("Eroski website loaded");
  let matches = [];

  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  date = year + "/" + month + "/" + day;

  let canContinue = true;

  for (const [i, ingredient] of ingredients.entries()) {
    canContinue = true;
    await page.waitForSelector("input[name=searchTerm]");
    console.log("search trobat");
    await page.$eval(
      "input[name=searchTerm]",
      (el, ingredient) => {
        el.value = ingredient.product;
      },
      ingredient
    );
    console.log("Ingredient introduït");

    await page.evaluate((selector) => {
      return document.querySelector(".search-button").click();
    });
    console.log("clicked");
    await page
      .waitForSelector(".product-description", { timeout: 5000 })
      .catch((e) => (canContinue = false));
    if (!ingredient.update) {
      console.log("classe product-description trobada");
      matches.push(
        await page.evaluate(() => [
          document.querySelector(".product-title > a").innerHTML,
          document
            .querySelector(".price-offer-now")
            .innerHTML.replace(/,/g, "'"),
        ])
      );
      if (!ingredient.update) {
        Product.create({
          tag: ingredient.product,
          supermarket: "Eroski",
          description: matches[i][0],
          price: matches[i][1],
          date: date,
        });
      } else {
        await Product.findOneAndUpdate(
          { tag: ingredient.product, supermarket: "Eroski" },
          { price: matches[i][1], date: date }
        );
      }
    } else {
      matches.push([ingredient.product, "NOT FOUND"]);
    }
  }
  await browser.close();
  console.log("web-scraping done");
  return matches;
};

// (async() => {
//     const startTime = now();
//     const res = await asyncFunc();
//     const endTime = now();

//     const timeTaken = endTime - startTime;

//     console.log(`Time taken to perform addition =
//             ${timeTaken.toFixed(3)} milliseconds`);
//   })();
