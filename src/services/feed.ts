import Parser from "rss-parser";
import { FeedArrayDTO, FetchRssFeedDTO } from "../DTOs/otherDTOs";
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
];

const allFeedUrls = [
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
		const feed: FetchRssFeedDTO = await parser.parseURL(el);
		feed.items.map(item => {
			if (item !== undefined) {
				newsArr.push({
					date: new Date(item.pubDate),
					link: item.link,
					artTitle: item.title,
				});
			}
		});
	}
	for (let el of allFeedUrls) {
		const feed: FetchRssFeedDTO = await parser.parseURL(el);
		feed.items.map(item => {
			if (item !== undefined && feedSearchWords.some(substring => item.title.includes(substring))) {
				newsArr.push({
					date: new Date(item.pubDate),
					link: item.link,
					artTitle: item.title,
				});
			}
		});
	}
	const finalArr = newsArr.sort((a, b) => b.date.getTime() - a.date.getTime());
	return finalArr;
}

export let news = await fetchRssFeed();

cron.schedule("0 */6 * * *", async () => {
	news = await fetchRssFeed();
});
