var deck = [];
var playerHand = [];
var dealerHand = [];

function InitializeGame() {
    initializeUserData();

    deck = createDeck();
    shuffleDeck(deck);

    disableGameElements();
}

function initializeUserData() {
    let storedUserData = localStorage.getItem("userData");

    if (!storedUserData) {
        const newUserData = {
            balance: 1000,
            betAmount: 50,
            wins: 0,
            losses: 0,
            ties: 0,
            blackjacks: 0,
            totalWinnings: 0,
            totalGames: 0,
            gameInProgress: false
        };

        saveUserData(newUserData);
        updateUserDataUI(newUserData);

        return newUserData;
    }

    const userData = JSON.parse(storedUserData);

    if (userData.gameInProgress) {
        userData.gameInProgress = false;
        userData.losses++;
        userData.totalGames++;
        userData.totalWinnings -= userData.betAmount;

        saveUserData(userData);

        messageElement =
            "Previous game was interrupted. It has been counted as a loss.";
    }

    updateUserDataUI(userData);

    return userData;
}

/* =========================
   LOCAL STORAGE
========================= */

function getUserData() {
    let storedUserData = localStorage.getItem("userData");

    if (!storedUserData) {
        return initializeUserData();
    }

    return JSON.parse(storedUserData);
}

function saveUserData(userData) {
    localStorage.setItem("userData", JSON.stringify(userData));
}

function updateUserStats(userData, resultType, betAmount) {
    userData.totalGames++;

    if (resultType === "blackjack") {
        userData.wins++;
        userData.blackjacks++;
        userData.totalWinnings += Math.floor(betAmount * 1.5);
    }
    else if (resultType === "win") {
        userData.wins++;
        userData.totalWinnings += betAmount;
    }
    else if (resultType === "loss") {
        userData.losses++;
        userData.totalWinnings -= betAmount;
    }
    else if (resultType === "push") {
        userData.ties++;
    }

    userData.gameInProgress = false;

    saveUserData(userData);
    updateUserDataUI(userData);
}

function setGameInProgress(inProgress) {
    const userData = getUserData();
    userData.gameInProgress = inProgress;
    saveUserData(userData);
}

function updateUserDataUI(userData) {
    document.getElementById("balance").innerText = userData.balance;
    document.getElementById("betAmount").value = userData.betAmount;

    const currentBetElement = document.getElementById("currentBet");
    const totalWins = document.getElementById("totalWins");
    const totalLosses = document.getElementById("totalLosses");
    const totalPushes = document.getElementById("totalPushes");
    const blackjackWins = document.getElementById("blackjackWins");
    const totalWinnings = document.getElementById("totalWinnings");
    const totalGames = document.getElementById("totalGames");
    const winlossRate = document.getElementById("winlossRate");

    if (currentBetElement) {
        currentBetElement.innerText = userData.betAmount;
    }
    if (totalWins) {
        totalWins.innerText = userData.wins;
    }
    if (totalLosses) {
        totalLosses.innerText = userData.losses;
    }
    if (totalPushes) {
        totalPushes.innerText = userData.ties;
    }
    if (blackjackWins) {
        blackjackWins.innerText = userData.blackjacks;
    }
    if (totalWinnings) {
        totalWinnings.innerText = userData.totalWinnings;
    }
    if (totalGames) {
        totalGames.innerText = userData.totalGames;
    }
    if (winlossRate) {
        const winRate = userData.wins / userData.totalGames * 100;
        if (isNaN(winRate)) {
            winlossRate.innerText = "0%";
            return;
        }
        winlossRate.innerText = winRate.toFixed(2) + "%";
    }
}

function getBalance() {
    const userData = getUserData();
    return parseInt(userData.balance);
}

function getBetAmount() {
    const userData = getUserData();
    return parseInt(userData.betAmount);
}

function updateBalance(amount) {
    const userData = getUserData();

    userData.balance += amount;

    saveUserData(userData);
    updateUserDataUI(userData);

    return userData.balance;
}

function updateBetAmount(amount) {
    const userData = getUserData();

    userData.betAmount = parseInt(amount);

    saveUserData(userData);
    updateUserDataUI(userData);
}

/* =========================
   UI STATE
========================= */

function enableGameElements() {
    document.querySelector(".game-info").style.display = "grid";
    document.querySelector(".cards-area").style.display = "grid";

    document.querySelector(".buttons button:nth-child(1)").style.display = "none";
    document.querySelector(".buttons button:nth-child(2)").style.display = "inline-block";
    document.querySelector(".buttons button:nth-child(3)").style.display = "inline-block";

    document.querySelector(".bet-section").style.display = "none";

    document.getElementById("message").innerText = "Cards dealt! Your move.";
}

function disableGameElements() {
    document.querySelector(".game-info").style.display = "none";
    document.querySelector(".cards-area").style.display = "none";

    document.querySelector(".buttons button:nth-child(1)").style.display = "inline-block";
    document.querySelector(".buttons button:nth-child(2)").style.display = "none";
    document.querySelector(".buttons button:nth-child(3)").style.display = "none";

    document.querySelector(".bet-section").style.display = "block";
}

function clearTable() {
    document.getElementById("playerCards").innerHTML = "";
    document.getElementById("dealerCards").innerHTML = "";

    document.getElementById("playerScore").innerText = "Score: -";
    document.getElementById("dealerScore").innerText = "Score: -";
}

function updatePlayerScore() {
    document.getElementById("playerScore").innerText = "Score: " + calculateHandValue(playerHand);
}

function updateDealerScore(hidden = false) {
    if (hidden) {
        document.getElementById("dealerScore").innerText = "Hidden";
        return;
    }

    document.getElementById("dealerScore").innerText = "Score: " + calculateHandValue(dealerHand);
}

function setMessage(text) {
        document.getElementById("message").innerText = text;
}
/* =========================
   BETTING
========================= */

function placeBet() {
    const betAmount = parseInt(document.getElementById("betAmount").value);

    updateBetAmount(betAmount);

    setMessage("New bet size: $" + betAmount);
}

/* =========================
   GAME LOGIC
========================= */

function startGame() {
    const balance = getBalance();
    const betAmount = getBetAmount();

    if (betAmount > balance) {
            setMessage("Not enough balance to place that bet. Please adjust your bet amount.");
        return;
    }

    if (deck.length < 15) {
        deck = createDeck();
        shuffleDeck(deck);
    }
    
    setGameInProgress(true);
    updateBalance(-betAmount);
    enableGameElements();

    playerHand = [];
    dealerHand = [];

    clearTable();

    playerHand.push(drawCard(deck));
    dealerHand.push(drawCard(deck));
    playerHand.push(drawCard(deck));
    dealerHand.push(drawCard(deck));

    renderInitialCards();

    updatePlayerScore();
    updateDealerScore(true);

    blackjackCheck();
}

function hit() {
    playerHand.push(drawCard(deck));

    const newCard = drawCardImage(playerHand[playerHand.length - 1]);
    document.getElementById("playerCards").appendChild(newCard);
    var message = "You hit and got " + newCard.alt + ". Your score is now " + calculateHandValue(playerHand) + ".";
    setMessage(message);
    updatePlayerScore();

    if (calculateHandValue(playerHand) > 21) {
        revealDealerHiddenCard();
        endGame();
    }
}

function stand() {
    revealDealerHiddenCard();
    while (calculateHandValue(dealerHand) < 17) {
        dealerHand.push(drawCard(deck));

        const newCard = drawCardImage(dealerHand[dealerHand.length - 1]);
        document.getElementById("dealerCards").appendChild(newCard);
        updateDealerScore();
    }
    endGame();
}

function endGame(resultType = null) {
    const betAmount = getBetAmount();

    const playerScore = calculateHandValue(playerHand);
    const dealerScore = calculateHandValue(dealerHand);

    let resultMessage = "";

    if (resultType === "blackjack") {
        const payout = Math.floor(betAmount * 2.5);
        resultMessage = "Blackjack! You win! (+" + payout + "$)";
        updateBalance(payout);
        updateUserStats(getUserData(), "blackjack", betAmount);
    }
    else if (resultType === "dealerBlackjack") {
        resultMessage = "Dealer has blackjack. Dealer wins. (-" + betAmount + "$)";
        updateUserStats(getUserData(), "loss", betAmount);
    }
    else if (resultType === "push") {
        resultMessage = "Both have blackjack. You get your bet back. (+" + betAmount + "$)";
        updateBalance(betAmount);
        updateUserStats(getUserData(), "push", betAmount);
    }
    else if (playerScore > 21) {
        resultMessage = "You busted! Dealer wins. (-" + betAmount + "$)";
        updateUserStats(getUserData(), "loss", betAmount);
    }
    else if (dealerScore > 21) {
        const payout = betAmount * 2;
        resultMessage = "Dealer busted! You win! (+" + payout + "$)";
        updateBalance(payout);
        updateUserStats(getUserData(), "win", betAmount);
    }
    else if (playerScore > dealerScore) {
        const payout = betAmount * 2;
        resultMessage = "You win! (+" + payout + "$)";
        updateBalance(payout);
        updateUserStats(getUserData(), "win", betAmount);
    }
    else if (playerScore < dealerScore) {
        resultMessage = "Dealer wins! (-" + betAmount + "$)";
        updateUserStats(getUserData(), "loss", betAmount);
    }
    else {
        resultMessage = "It's a tie! You get your bet back. (+" + betAmount + "$)";
        updateBalance(betAmount);
        updateUserStats(getUserData(), "push", betAmount);
    }

    setMessage(resultMessage);
    //Disable hit and stand buttons even though we call them due to timeout, to prevent any weird bugs where the player can click them multiple times before the timeout disables them
    document.querySelector(".buttons button:nth-child(2)").style.display = "none";
    document.querySelector(".buttons button:nth-child(3)").style.display = "none";
    setTimeout(function () {
        disableGameElements();
        clearTable();
    }, 4000);
}

/* =========================
   CARD RENDERING
========================= */

function renderInitialCards() {
    const playerCardsElement = document.getElementById("playerCards");
    const dealerCardsElement = document.getElementById("dealerCards");

    playerCardsElement.appendChild(drawCardImage(playerHand[0]));
    playerCardsElement.appendChild(drawCardImage(playerHand[1]));

    dealerCardsElement.appendChild(drawCardImage(dealerHand[0]));
    dealerCardsElement.appendChild(drawBackCardImage());
}

function revealDealerHiddenCard() {
    const dealerCardsElement = document.getElementById("dealerCards");

    if (dealerCardsElement.children.length > 1) {
        dealerCardsElement.children[1].remove();
    }

    if (dealerHand.length > 1) {
        dealerCardsElement.appendChild(drawCardImage(dealerHand[1]));
    }

    updateDealerScore();
}

/* =========================
   BLACKJACK CHECK
========================= */

function blackjackCheck() {
    const playerHasBlackjack = hasBlackjack(playerHand);
    const dealerHasBlackjack = hasBlackjack(dealerHand);

    if (!playerHasBlackjack && !dealerHasBlackjack) {
        return false;
    }

    revealDealerHiddenCard();

    if (playerHasBlackjack && dealerHasBlackjack) {
        endGame("push");
    }
    else if (playerHasBlackjack) {
        endGame("blackjack");
    }
    else if (dealerHasBlackjack) {
        endGame("dealerBlackjack");
    }

    return true;
}

function hasBlackjack(hand) {
    return hand.length === 2 && calculateHandValue(hand) === 21;
}

/* =========================
   OPTIONS
========================= */

function topUpBalance() {
    updateBalance(1000);
    setMessage("Balance topped up by $1000! Happy gambling!");
}

function deleteToken() {
    localStorage.removeItem("userData");

    document.getElementById("balance").innerText = "1000";
    setMessage("Local storage deleted and page will refresh in 3 seconds.");

    setTimeout(function () {
        location.reload();
    }, 3000);
}