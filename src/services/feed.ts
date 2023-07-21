import Parser from "rss-parser";
import { FeedArrayDTO, FeedsDTO } from "../DTOs/otherDTOs";
import cron from "node-cron";

const parser = new Parser();
const autoUrls = [
	"https://www.autocentre.ua/ua/feed",
	"https://ampercar.com/feed",
	"https://autogeek.com.ua/feed",
	"https://autotema.org.ua/feed",
	"https://mmr.net.ua/feed",
	"https://uamotors.com.ua/feed",
	"https://auto.dip.org.ua/feed",
	"https://motorcar.com.ua/feed/",
	"https://avtodream.org/rss.xml",
	"https://ukrautoprom.com.ua/feed",
	"https://auto.ria.com/rss",
	"https://autonews.autoua.net/rss/",
	"https://auto.bigmir.net/rss",
];
// "https://news.infocar.ua/rss/",
// 	"https://www.autoconsulting.com.ua/rss.html",

async function fetchRssFeed() {
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
	const finalArr = newsArr.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
	return finalArr;
}

// export let news = await fetchRssFeed();

// cron.schedule("0 */6 * * *", async () => { // did'n work with render(work only in payed  version), but needed 4 app
// 	news = await fetchRssFeed();
// });
