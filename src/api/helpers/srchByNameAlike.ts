export function searchAlike(searchStr: string) {
	let response: string = "";
	for (let [key, values] of Object.entries(searchAlikeArrs)) {
		values.map(arrEl => {
			if (arrEl.slice(0, searchStr.length) === searchStr) {
				response = key;
			}
		});
	}
	if (response.length) return response;
	return null;
}

const searchAlikeArrs = {
	kosei: [
		"kosei",
		"kasei",
		"косей",
		"касей",
		"косэй",
		"касэй",
		"косеи",
		"касеи",
		"косеі",
		"коцеі",
		"коцей",
		"косеї",
		"касеі",
		"касей",
	],
	inziaone: [
		"inziaone",
		"інзі ан",
		"інзі ван",
		"інзі аонэ",
		"инзи ан",
		"инзи ван",
		"инзи аонэ",
		"инзи аоне",
		"энзи ооне",
		"энзи оонэ",
		"inzi aone",
		"inzi aone",
		"enzo aone",
		"enzo aone",
		"інзіан",
		"інзіван",
		"інзіаонэ",
		"инзиан",
		"инзиван",
		"инзиаонэ",
		"инзиаоне",
		"энзиооне",
		"энзиоонэ",
		"inziaone",
		"inziaone",
		"enzoaone",
		"enzoaone",
	],
	marcello: ["marcello", "marcelo", "marchello", "марчело", "марчелло", "маркело", "маркелло", "марселло", "марсело"],
	mkw: ["mkv", "mkw", "мкв", "мвк", "mcv", "mwc"],
	replica: ["replika", "репліка", "рэплика", "реплика", "replik", "replic"],
};
