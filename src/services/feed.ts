import Parser from "rss-parser";
import { FeedArrayDTO, FeedsDTO } from "../DTOs/otherDTOs";
import cron from "node-cron";

const parser = new Parser({
	headers: {
		"User-Agent":
			"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36 OPR/38.0.2220.41",
	},
});
const autoUrls = [
	"https://ampercar.com/feed",
	"https://autogeek.com.ua/feed",
	"https://mmr.net.ua/feed",
	"https://uamotors.com.ua/feed",
	"https://auto.dip.org.ua/feed",
	"https://avtodream.org/rss.xml",
	"https://ukrautoprom.com.ua/feed",
	"https://auto.ria.com/rss",
	"https://autonews.autoua.net/rss",
	"https://auto.bigmir.net/rss",
];

export async function fetchRssFeed() {
	try {
		let newsArr: FeedArrayDTO[] = [];
		for (let el of autoUrls) {
			const feed: FeedsDTO = await parser.parseURL(el);
			feed.items.forEach(item => {
				newsArr.push({
					pubDate: new Date(item.pubDate),
					link: item.link,
					title: item.title,
					sourceName: feed.title,
				});
			});
		}
		return newsArr.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
	} catch (err) {
		console.log("Got an error with car news");
	}
}

// export const news = await fetchRssFeed();
export const news = [];
// cron.schedule("0 */6 * * *", async () => { // did'n work with render(work only in payed version), but needed 4 app runs every 6h
// 	news = await fetchRssFeed();
// });
