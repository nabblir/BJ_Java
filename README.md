# Blackjack

Ett webbläsarbaserat Blackjack-spel byggt med vanilla JavaScript, HTML och CSS.

Projektet simulerar en klassisk Blackjack-upplevelse med betting, dealer-logik, statistik som sparas i Local Storage och ett casino-inspirerat gränssnitt.

---

# Funktioner

* Full Blackjack-gameplay
* Betting-system med valbara insatsnivåer
* Dealer-logik där dealern drar kort tills minst 17
* Statistik som sparas lokalt med Local Storage
* Blackjack-utbetalning enligt 3:2
* Hantering av avbrutna spel vid siduppdatering
* Casino-inspirerat gränssnitt
* Knapp för att rensa Local Storage
* Funktion för att fylla på saldo

---

# Tekniker

* HTML5
* CSS3
* Vanilla JavaScript

Projektet använder inga externa ramverk eller bibliotek.

---

# Projektstruktur

```txt
.
├── index.html
├── index.css
├── cardLogic.js
└── gameLogic.js
```

---

# Hur spelet fungerar

## Blackjack-regler

* Målet är att komma så nära 21 som möjligt utan att gå över.
* Klädda kort är värda 10.
* Ess kan räknas som 1 eller 11.
* Dealern måste dra kort tills handen är värd minst 17.
* Blackjack betalar 3:2.
* Vid lika resultat får spelaren tillbaka sin insats.

---

# Spelsystem

## Betting-system

Spelaren kan välja en insats innan varje runda. Insatsen dras från saldot när rundan startar.

Vid vinst får spelaren tillbaka sin insats plus vinsten. Vid blackjack används en 3:2-utbetalning. Vid förlust behåller dealern insatsen och statistiken uppdateras.

---

## Statistik

Spelet sparar statistik i `localStorage`, vilket gör att datan finns kvar även om sidan laddas om.

Statistiken som sparas är:

* Nuvarande saldo
* Nuvarande insats
* Antal vinster
* Antal förluster
* Antal push/ties
* Antal blackjack-vinster
* Totala nettovinster
* Totalt antal spelade rundor
* Om ett spel pågår eller inte

---

## Hantering av siduppdatering under pågående spel

Spelet sparar om en runda är aktiv med hjälp av värdet `gameInProgress`.

Om spelaren uppdaterar sidan eller stänger fliken mitt under en aktiv runda räknas rundan automatiskt som en förlust när spelet laddas igen.

Det innebär att:

* `losses` ökar med 1
* `totalGames` ökar med 1
* `totalWinnings` minskar med aktuell insats
* `gameInProgress` sätts tillbaka till `false`

Saldot minskas inte igen vid siduppdatering, eftersom insatsen redan har dragits när rundan startade.

---

# Gränssnitt

Spelet består av tre huvudsakliga delar:

* En vänsterpanel med spelregler
* En central spelruta med betting, kort, poäng och knappar
* En högerpanel med alternativ och statistik

Gränssnittet använder ett casino-inspirerat tema med mörkgrön bakgrund, guldfärgade detaljer och tydliga kortytor.

---

# Viktiga filer

## `index.html`

Innehåller spelets HTML-struktur:

* Regler
* Betting-sektion
* Spelområde
* Kortytor
* Meddelanderuta
* Knappar
* Statistikpanel

---

## `index.css`

Innehåller all styling för spelet:

* Sidlayout
* Blackjack-bord
* Kortytor
* Knappar
* Statistikpanel
* Regler
* Responsiv struktur

---

## `cardLogic.js`

Innehåller kortlogiken:

* Skapa kortlek
* Blanda kortlek
* Dra kort
* Rendera kortbilder
* Räkna handvärde
* Hantera ess

---

## `gameLogic.js`

Innehåller spellogiken:

* Starta runda
* Hantera hit och stand
* Dealer-tur
* Avgöra resultat
* Uppdatera saldo
* Uppdatera statistik
* Spara och läsa från Local Storage
* Hantera avbrutna spel vid refresh
* Uppdatera gränssnittet

---

# Exempel på sparad data i Local Storage

```json
{
  "balance": 1000,
  "betAmount": 50,
  "wins": 0,
  "losses": 0,
  "ties": 0,
  "blackjacks": 0,
  "totalWinnings": 0,
  "totalGames": 0,
  "gameInProgress": false
}
```

---

# Så kör du projektet

1. Ladda ner eller klona projektet.
2. Öppna `index.html` i webbläsaren.
3. Välj insats och tryck på `Deal cards`.

Projektet kräver ingen installation, build-process eller server.

---

# Möjliga framtida förbättringar

* Split hands
* Double down
* Insurance
* Ljud
* Animationer för kortutdelning
* Förbättrad mobilanpassning
* Leaderboard
* Användarkonton
* Fler visuella teman

---

# Skapare

Skapat av Kevin Spehling.

---

# Licens

Detta projekt är fritt att använda i utbildningssyfte.
