import { cheerio } from "./deps.ts";
import { processNum } from "./utils.ts";

interface IntermediatePoke {
    dexNum: number;
    pokeName: string;
    link: string;
}

const PKMN_LIST_URL = `https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_National_Pok%C3%A9dex_number`;

async function getImageUrl(pkmnLink: string, name: string): Promise<string> {
    const pkmnPage = await fetch(`https://bulbapedia.bulbagarden.net/${pkmnLink}`);
    const pkmn = cheerio.load(await pkmnPage.text());

    const image = pkmn(`a.image[title="${name}"] > img`);

    return pkmn(image).attr("src")!;
}

try {
    const pkmnPage = await fetch(PKMN_LIST_URL);
    const pkmn = cheerio.load(await pkmnPage.text());

    const trows = pkmn(`table > tbody > tr[style="background:#FFF"]`);

    const pokes: IntermediatePoke[] = [];
    trows.each((_i, elt) => {
        const num = pkmn(elt).children("td:nth-child(2)");
        const name = pkmn(elt).children("td:nth-child(4)");
        const a = pkmn(name).children("a");
        const link = pkmn(a).attr("href");
        const primaryType = pkmn(elt).children("td:nth-child(5)");
        const secondaryType = pkmn(elt).children("td:nth-child(6)");

        const dexNum = processNum(num.text());
        const pokeName = name.text().trim();

        if (!primaryType.text().includes("Steel") && !secondaryType.text().includes("Steel") && dexNum != 0) {
            // No steel-types
            pokes.push({
                dexNum,
                pokeName,
                link: link!,
            });
        }
    });

    for (const { dexNum, pokeName, link } of pokes) {
        const imageUrl = await getImageUrl(link, pokeName);
        console.log('{');
        console.log(`\tpokedexNum: ${dexNum},`);
        console.log(`\tname: "${pokeName}",`);
        console.log(`\timageUrl: "https:${imageUrl}",`);
        console.log('},');
    }
} catch (err) {
    console.error(err);
}