const suits = ["hearts", "diamonds", "clubs", "spades"];

const ranks = [
    { name: "2", value: 2 },
    { name: "3", value: 3 },
    { name: "4", value: 4 },
    { name: "5", value: 5 },
    { name: "6", value: 6 },
    { name: "7", value: 7 },
    { name: "8", value: 8 },
    { name: "9", value: 9 },
    { name: "10", value: 10 },
    { name: "jack", value: 10 },
    { name: "queen", value: 10 },
    { name: "king", value: 10 },
    { name: "ace", value: 11 }
];

function createDeck() {
    const newDeck = [];

    for (const suit of suits) {
        for (const rank of ranks) {
            newDeck.push({
                rank: rank.name,
                suit: suit,
                value: rank.value,
                image: `cards/${rank.name}_of_${suit}.png`
            });
        }
    }

    return newDeck;
}

function drawCard(deck) {
    return deck.pop();
}

function calculateHandValue(hand) {
    let total = 0;
    let aces = 0;

    for (const card of hand) {
        total += card.value;

        if (card.rank === "ace") {
            aces++;
        }
    }

    while (total > 21 && aces > 0) {
        total -= 10;
        aces--;
    }

    return total;
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));

        const temp = deck[i];
        deck[i] = deck[randomIndex];
        deck[randomIndex] = temp;
    }
}

function drawCardImage(card) {
    const img = document.createElement("img");
    img.src = card.image;
    img.alt = `${card.rank} of ${card.suit}`;
    img.classList.add("card");
    return img;
}

function drawBackCardImage() {
    const img = document.createElement("img");
    img.src = 'cards/back.png';
    img.alt = 'Hidden card';
    img.classList.add("card");
    return img;
}