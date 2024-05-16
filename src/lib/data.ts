import DB from "$lib/database";
import { type FilledBook, BookType, type Entity } from "$lib/models";

const newEntity = (content: string): Entity => ({ content: content });

const newBook = (
    id: number,
    cover: string,
    title: string,
    year: number,
    pages: number,
    description: string,
    author: Entity[],
    publisher: Entity[],
    category: Entity[],
    subtitle: string = "",
): FilledBook => {
    return {
        id: id,
        cover: cover,
        title: title,
        subtitle: subtitle,
        type: BookType.Paperback,
        published: new Date(year, 0),
        pages: pages,
        description: description,

        bbid: "",
        isbn10: "",
        isbn13: "",
        olid: "",

        owned: false,
        purchased: new Date(2024, 0),
        rating: 0,

        author: author,
        publisher: publisher,
        series: [],
        category: category,

        tag: [],
        review: [],
        note: [],
        quote: [],
        loan: [],

        status: [],
    };
};

export const BOOKS = [
    newBook(
        1,
        "https://upload.wikimedia.org/wikipedia/commons/4/45/Dracula_1st_ed_cover_reproduction.jpg",
        "Dracula",
        1897,
        354,
        "Dracula tells its story through journal entries, diaries, letters, and telegrams written by the novel's main characters. In form it is, fundamentally, an epistolary novel, though the presence of telegrams and a “phonograph diary” shows the manner in which Stoker was incorporating communications technologies of his time.",
        [newEntity("Bram Stoker")],
        [newEntity("Grosset & Dunlap")],
        [newEntity("Horror"), newEntity("Gothic")],
    ),
    newBook(
        2,
        "https://upload.wikimedia.org/wikipedia/commons/3/35/Frankenstein_1818_edition_title_page.jpg",
        "Frankenstein",
        1818,
        280,
        "Frankenstein tells the story of gifted scientist Victor Frankenstein who succeeds in giving life to a being of his own creation. However, this is not the perfect specimen he imagines that it will be, but rather a hideous creature who is rejected by Victor and mankind in general.",
        [newEntity("Mary Shelley")],
        [newEntity("Lackington"), newEntity("Hughes"), newEntity("Harding"), newEntity("Mavor & Jones")],
        [newEntity("Horror"), newEntity("Gothic")],
        "or, The Modern Prometheus",
    ),
    newBook(
        3,
        "https://upload.wikimedia.org/wikipedia/commons/0/0a/The_Time_Machine_%28H._G._Wells%2C_William_Heinemann%2C_1895%29_title_page.jpg",
        "The Time Machine",
        1895,
        84,
        "H.G. Wells's The Time Machine offers a dystopian vision of humanity's future. A scientist builds a time machine and travels to future. He finds that humanity has devolved into two races: the childlike Eloi and the monstrous Morlocks. His machine disappears, so he explores the future world.",
        [newEntity("H. G. Wells")],
        [newEntity("William Heinemann"), newEntity("Henry Holt"),],
        [newEntity("Science Fiction")],
    ),
    newBook(
        4,
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Stevenson_-_Treasure_island%2C_1933.djvu/page1-2744px-Stevenson_-_Treasure_island%2C_1933.djvu.jpg",
        "Treasure Island",
        1883,
        292,
        "Set in the Golden Age of Piracy, the story follows young Jim Hawkins as he embarks on a perilous journey to uncover buried treasure. Brimming with vivid characters, treacherous pirates, and unexpected twists, “Treasure Island” remains a timeless tale of greed, loyalty, and the allure of buried riches",
        [newEntity("Robert Louis Stevenson")],
        [newEntity("Cassell and Company")],
        [newEntity("Adventure Fiction"), newEntity("Young Adult")],
    ),
    newBook(
        5,
        "https://upload.wikimedia.org/wikipedia/commons/6/61/Huckleberry_Finn_book.JPG",
        "Adventures of Huckleberry Finn",
        1884,
        362,
        "Mark Twain's classic The Adventures of Huckleberry Finn (1884) is told from the point of view of Huck Finn, a barely literate teen who fakes his own death to escape his abusive, drunken father.",
        [newEntity("Mark Twain")],
        [newEntity("Chatto & Windus"), newEntity("Charles L. Webster And Company.")],
        [newEntity("Picaresque Novel")],
    ),
    newBook(
        6,
        "https://upload.wikimedia.org/wikipedia/commons/d/d6/Louis_Fran%C3%A7ais-Dant%C3%A8s_sur_son_rocher.jpg",
        "The Count of Monte Cristo",
        1844,
        1276,
        "Thrown in prison for a crime he has not committed, Edmond Dantès is confined to the grim fortress of If. There he learns of a great hoard of treasure hidden on the Isle of Monte Cristo and he becomes determined not only to escape, but also to unearth the treasure and use it to plot the destruction of the three men responsible for his incarceration. Dumas’ epic tale of suffering and retribution, inspired by a real-life case of wrongful imprisonment, was a huge popular success when it was first serialized in the 1840s.",
        [newEntity("Alexandre Dumas")],
        [],
        [newEntity("Historical Novel"), newEntity("Adventure")],
    ),
    newBook(
        7,
        "https://upload.wikimedia.org/wikipedia/commons/4/4e/Houghton_AC85_B9345_911s_-_Secret_Garden%2C_1911_-_cover.jpg",
        "The Secret Garden",
        1911,
        375,
        "The Secret Garden tells the story of Mary Lennox, a spoiled young English girl being raised in India. After the death of her parents, she is sent to live at her mysterious uncle's Yorkshire estate, Misselthwaite Manor.",
        [newEntity("Frances Hodgson Burnett")],
        [newEntity("Frederick A. Stokes"), newEntity("William Heinemann")],
        [newEntity("Children's Novel")],
    ),
    newBook(
        8,
        "https://upload.wikimedia.org/wikipedia/commons/a/a5/Franz_Kafka_Die_Verwandlung_1916_Orig.-Pappband.jpg",
        "The Metamorphosis",
        1915,
        201,
        "Franz Kafka's The Metamorphosis is about Gregor Samsa, a traveling salesman who wakes up one day to find that he has transformed into a giant insect. His family is disgusted with him, especially when he is no longer able to earn income. Gregor eventually dies after deciding that he is a burden to his family.",
        [newEntity("Franz Kafka")],
        [newEntity("Kurt Wolff Verlag"), newEntity("Leipzig")],
        [],
    ),
    newBook(
        9,
        "https://upload.wikimedia.org/wikipedia/commons/1/1a/Odyssey-crop.jpg",
        "The Odyssey",
        1614,
        384,
        "The Odyssey is an epic poem in 24 books traditionally attributed to the ancient Greek poet Homer. The poem is the story of Odysseus, king of Ithaca, who wanders for 10 years (although the action of the poem covers only the final six weeks) trying to get home after the Trojan War",
        [newEntity("Homer")],
        [],
        [newEntity("Epic Poetry")],
    ),
    newBook(
        10,
        "https://upload.wikimedia.org/wikipedia/commons/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg",
        "The Great Gatsby",
        1925,
        180,
        "Set in Jazz Age New York, it tells the story of Jay Gatsby, a self-made millionaire, and his pursuit of Daisy Buchanan, a wealthy young woman whom he loved in his youth.",
        [newEntity("F. Scott Fitzgerald")],
        [newEntity("Charles Scribner's Sons")],
        [newEntity("Historical Fiction")],
    ),
];

export const addDummyBooks = async () => {
    await Promise.all(BOOKS.map(async (book) => {
        await DB.addBook(book);
    }));
};
