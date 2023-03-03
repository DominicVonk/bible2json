import { readFile, writeFile } from 'node:fs/promises';
import { xml2js } from 'xml-js';

const dutch = await readFile('dut-statenvertaling.zefania.xml', 'utf8');
const english = await readFile('eng-kjv.zefania.xml', 'utf8');




const dutchOriginalXml = xml2js(dutch, { compact: true});
const englishOriginalXml = xml2js(english, { compact: true});

const book2json = (xml) => {
    const books = {};
for (const book of xml.XMLBIBLE.BIBLEBOOK) {
    const name = book._attributes.bname;
    const number = book._attributes.bnumber;
    const shortName = book._attributes.bsname;
    const chapters = [];
    if (Array.isArray(book.CHAPTER)) {
        for(const chapter of book.CHAPTER) {
            const verses = [];
            const number = chapter._attributes.cnumber;

            for(const verse of chapter.VERS) {
                const number = verse._attributes.vnumber;
                const text = verse._text;
                verses.push({number, text});
            }

            chapters.push({
                number,
                verses
            })

        }
    } else {
        const chapter = book.CHAPTER;
        const verses = [];
        const number = chapter._attributes.cnumber;

        for(const verse of chapter.VERS) {
            const number = verse._attributes.vnumber;
            const text = verse._text;
            verses.push(text);
        }

        chapters.push({
            number,
            verses
        })
    }
    books[number] = {
        name,
        shortName,
        chapters
    }
}
return books;
}


writeFile('dut.json', JSON.stringify(book2json(dutchOriginalXml), null, 2));
writeFile('eng.json', JSON.stringify(book2json(englishOriginalXml), null, 2));

