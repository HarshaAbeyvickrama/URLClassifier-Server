import fetch from "node-fetch";
import cheerio from "cheerio";

export async function getCategory(siteURL) {
    let url = "https://www.fortiguard.com/webfilter?q=" + siteURL + "&version=9";
    let page = await fetch(url);
    let text = page.text();
    const $ = cheerio.load(await text);
    return $('meta[property="og:description"]').attr("content");
}

export async function validate(hist) {
    return hist.map((item) => {
        let domain = parseURL(item.url);
        return {...item, url: domain};
    });
}

function parseURL(url) {
    let host = url.split("//")[1];
    return host.split("/")[0];
}

export function categorize(history) {
    history.forEach(async (item, index) => {
        sleep(3000).then(() => {
            getCategory(item.url).then((cat) => {
                console.log(item.url + "---->" + cat);
            })
        })
    })
}

const sleep = (duration) => {
    return new Promise(resolve => setTimeout(resolve, duration));
}

// console.log(parseURL("https://www.google.com/hsgfjsdhgfjsdhgf"));
