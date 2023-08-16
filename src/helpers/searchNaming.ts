const searchAlikeArr = {
	kosei: ["kosei", "kasei", "косей", "касей", "косэй", "касэй", "косеи", "касеи", "косеі", "касеі"],
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
	],
	marcello: ["marcello", "marcelo", "marchello", "марчело", "марчелло", "маркело"],
	mkw: ["mkv", "mkw", "мкв"],
	replica: ["replika", "репліка", "рэплика", "реплика", "replik", "replic"],
};

export function searchAlike(searchStr: string) {
	let response: string = "";
	for (let [key, values] of Object.entries(searchAlikeArr)) {
		values.map(arrEl => {
			if (arrEl.slice(0, searchStr.length) === searchStr) {
				response = key;
			}
		});
	}
	if (response.length) {
		return response;
	}
	return null;
}
