import Parser from "rss-parser";
import { FeedArrayDTO, FeedsDTO } from "../DTOs/otherDTOs";
import cron from "node-cron";

const parser = new Parser({
	requestOptions: {
		rejectUnauthorized: false,
	},
	headers: { "User-Agent": "Chrome" },
});
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
	"https://www.autoconsulting.com.ua/rss.html",
];

const allFeedUrls = [
	"https://tsn.ua/rss/all-xml",
	"https://sundries.com.ua/feed",
	"https://static.censor.net/censornet/rss/rss_uk_news.xml",
	"https://bigkyiv.com.ua/feed",
	"https://newformat.info/feed",
	"https://vikna.tv/feed/",
	"https://hvylya.net/feed/rss2.xml",
	"https://agropravda.com/feed/",
	"https://hromadske.ua/feed/",
	"https://24tv.ua/rss/all.xml",
	"https://vsviti.com.ua/feed",
	"https://life.fakty.com.ua/ua/feed/",
	"https://nnews.com.ua/feed",
];

const feedSearchWords = [
	"Уживані авто",
	"водител",
	"пальне",
	"водії",
	"Tesla",
	"пливо",
	"автомобілістам",
	"АЗС",
	"автомобилистам",
	"автомобиль",
	"дизель",
	"бензин",
	"автомобили",
	"кросовер",
	"седан",
	"Toyota",
	"Volvo",
	"Mazda",
	"Nissan",
	"Cybertruck",
	"Ford",
	"Skoda",
	"автогаз",
	"розмитнення авто",
];

async function fetchRssFeed() {
	let newsArr: FeedArrayDTO[] = [];
	for (let el of autoUrls) {
		const feed: FeedsDTO = await parser.parseURL(el);
		feed.items.forEach(item => {
			if (feedSearchWords.some(substring => item.title.includes(substring))) {
				newsArr.push({
					pubDate: new Date(item.pubDate),
					link: item.link,
					title: item.title,
					sourceName: feed.title,
				});
			}
		});
	}
	for (let el of allFeedUrls) {
		const feed: FeedsDTO = await parser.parseURL(el);
		feed.items.forEach(item => {
			if (feedSearchWords.some(substring => item.title.includes(substring))) {
				newsArr.push({
					pubDate: new Date(item.pubDate),
					link: item.link,
					title: item.title,
					sourceName: feed.title,
				});
			}
		});
	}
	const finalArr = newsArr.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
	return finalArr;
}

export let news = await fetchRssFeed();

// cron.schedule("0 */6 * * *", async () => { // did'n work with render(work only in payed  version), but needed 4 app
// 	news = await fetchRssFeed();
// });
