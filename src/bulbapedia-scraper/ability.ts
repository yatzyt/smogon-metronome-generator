import { cheerio } from "./deps.ts";
import { processNum } from "./utils.ts";

const ABILITY_LIST_URL = `https://bulbapedia.bulbagarden.net/wiki/Ability`;

try {
    const abilityPage = await fetch(ABILITY_LIST_URL);
    const ability = cheerio.load(await abilityPage.text());

    const trows = ability(`h2:contains("Abilities") + table > tbody > tr > td > table > tbody > tr`);
    trows.each((i, elt) => {
        if (i === 0) {
            // first row is a header, skip it
            return;
        }
        const num = ability(elt).children("td:nth-child(1)");
        const name = ability(elt).children("td:nth-child(2)");
        console.log("{");
        console.log(`\tnum: ${processNum(num.text())},`);
        console.log(`\tname: "${name.text().trim()}",`);
        console.log("},");
    });
} catch (err) {
    console.error(err);
}