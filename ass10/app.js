let userScore = 0;
let computerScore = 0;
let contract = null;
let signer = null;
let account = null;
let isProcessing = false;
let gameHistory = [];
let wins = 0;
let losses = 0;
let draws = 0;

const userScore_span = document.getElementById('user-score');
const computerScore_span = document.getElementById('computer-score');
const result_p = document.querySelector('.result > p');
const rock_div = document.getElementById('r');
const paper_div = document.getElementById('p');
const scissors_div = document.getElementById('s');

const action_msg = document.getElementById('action-msg');
const connectBtn = document.getElementById('connectBtn');
const betAmountInput = document.getElementById('betAmount');
const historyList = document.getElementById('historyList');
const winsCount = document.getElementById('wins-count');
const lossesCount = document.getElementById('losses-count');
const drawsCount = document.getElementById('draws-count');

const contractAddress = "0xb5713fb3f4Ab6eE84730fEa506DeA5B43dE53D23";
const contractABI = [
    {
        "type": "constructor",
        "inputs": [],
        "stateMutability": "payable"
    },
    {
        "name": "ContractFunded",
        "type": "event",
        "inputs": [
            {
                "name": "funder",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "amount",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "name": "RockPaperScissorsResult",
        "type": "event",
        "inputs": [
            {
                "name": "player",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "betAmount",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "name": "playerMove",
                "type": "uint8",
                "indexed": false,
                "internalType": "uint8"
            },
            {
                "name": "computerMove",
                "type": "uint8",
                "indexed": false,
                "internalType": "uint8"
            },
            {
                "name": "result",
                "type": "int8",
                "indexed": false,
                "internalType": "int8"
            },
            {
                "name": "payout",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "name": "getGambaInfo",
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "name": "contractBalance",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "minimumBet",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "maximumBet",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "name": "maxBet",
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "name": "minBet",
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "name": "rockPaperScissors",
        "type": "function",
        "inputs": [
            {
                "name": "_playerMove",
                "type": "uint8",
                "internalType": "uint8"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "int8",
                "internalType": "int8"
            }
        ],
        "stateMutability": "payable"
    },
    {
        "type": "receive",
        "stateMutability": "payable"
    }
];

document.addEventListener('DOMContentLoaded', function () {
    initApp();
});

function getComputerChoice() {
    const choices = ['r', 'p', 's'];
    const randomNumber = Math.floor(Math.random() * 3);
    return choices[randomNumber];
}

function convertToWord(letter) {
    if (letter === 'r') return "Rock";
    if (letter === 'p') return "Paper";
    return "Scissors";
}

function getChoiceIcon(letter) {
    if (letter === 'r') return "🪨";
    if (letter === 'p') return "📄";
    return "✂️";
}

function win(userChoice, computerChoice) {
    userScore++;
    wins++;
    // FIXED: Update BOTH scores and winrate display
    userScore_span.innerHTML = userScore;
    computerScore_span.innerHTML = computerScore;
    updateWinrateDisplay(); // FIXED: Added this line
    result_p.innerHTML = `${convertToWord(userChoice)} (user) beats ${convertToWord(computerChoice)}(comp). You win, yay!`;
}

function lose(userChoice, computerChoice) {
    computerScore++;
    losses++;
    // FIXED: Update BOTH scores and winrate display
    userScore_span.innerHTML = userScore;
    computerScore_span.innerHTML = computerScore;
    updateWinrateDisplay(); // FIXED: Added this line
    result_p.innerHTML = `${convertToWord(userChoice)} (user) loses to ${convertToWord(computerChoice)}(comp). You lost, womp womp.`;
}

function draw(userChoice, computerChoice) {
    draws++;
    // FIXED: Update winrate display
    updateWinrateDisplay(); // FIXED: Added this line
    result_p.innerHTML = `${convertToWord(userChoice)} (user) equals ${convertToWord(computerChoice)}(comp). It's a draw, ggs ig`;
}

function addGameToHistory(index, playerChoice, computerChoice, betAmount, result, payout) {
    const historyItem = {
        index: index,
        playerChoice: playerChoice,
        computerChoice: computerChoice,
        betAmount: betAmount,
        result: result,
        payout: payout,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    gameHistory.unshift(historyItem); // Add to beginning for newest first
    
    // Keep only last 20 games to avoid clutter
    if (gameHistory.length > 20) {
        gameHistory.pop();
    }
    
    // Update history list
    updateHistoryList();
}

function updateWinrateDisplay() {
    winsCount.textContent = wins;
    lossesCount.textContent = losses;
    drawsCount.textContent = draws;
}

function updateHistoryList() {
    historyList.innerHTML = '';
    
    if (gameHistory.length === 0) {
        historyList.innerHTML = '<div class="history-empty">No games played yet</div>';
        return;
    }
    
    gameHistory.forEach((game) => {
        const historyItem = document.createElement('div');
        historyItem.className = `history-item ${game.result}`;
        
        let netAmount;
        let amountClass;
        
        if (game.result === 'win') {
            netAmount = game.payout - game.betAmount;
            amountClass = 'positive';
        } else if (game.result === 'loss') {
            netAmount = -game.betAmount;
            amountClass = 'negative';
        } else {
            netAmount = 0;
            amountClass = 'neutral';
        }
        
        const amountSign = netAmount > 0 ? '+' : '';
        
        historyItem.innerHTML = `
            <div class="history-header">
                <span>Game #${game.index}</span>
                <span>${game.timestamp}</span>
            </div>
            <div>
                ${getChoiceIcon(game.playerChoice)} vs ${getChoiceIcon(game.computerChoice)}
                <span class="result-badge ${game.result}">${game.result.toUpperCase()}</span>
            </div>
            <div class="history-details">
                <small>Bet: ${game.betAmount.toFixed(4)}</small>
                <div class="amount-change ${amountClass}">${amountSign}${netAmount.toFixed(4)} tBNB</div>
            </div>
        `;
        
        historyList.appendChild(historyItem);
    });
}

async function game(userChoice) {
    if (!contract) {
        action_msg.innerHTML = "Please connect your wallet first!";
        return;
    }

    if (isProcessing) {
        action_msg.innerHTML = "Please wait...";
        return;
    }

    try {
        isProcessing = true;

        const betAmountBNB = parseFloat(betAmountInput.value);
        if (isNaN(betAmountBNB) || betAmountBNB <= 0) {
            action_msg.innerHTML = "Please enter a valid bet amount!";
            isProcessing = false;
            return;
        }

        const betAmountWei = ethers.utils.parseEther(betAmountBNB.toString());

        let minBetWei, maxBetWei;
        try {
            minBetWei = await contract.minBet();
            maxBetWei = await contract.maxBet();

            if (betAmountWei.lt(minBetWei)) {
                action_msg.innerHTML = `Bet too low! Min: ${ethers.utils.formatEther(minBetWei)} tBNB`;
                isProcessing = false;
                return;
            }

            if (betAmountWei.gt(maxBetWei)) {
                action_msg.innerHTML = `Bet too high! Max: ${ethers.utils.formatEther(maxBetWei)} tBNB`;
                isProcessing = false;
                return;
            }
        } catch (error) {
            console.error("Error checking bet limits:", error);
        }

        action_msg.innerHTML = "Processing...";
        setChoicesEnabled(false);

        let moveValue;
        if (userChoice === 'r') moveValue = 0;
        else if (userChoice === 'p') moveValue = 1;
        else if (userChoice === 's') moveValue = 2;

        const tx = await contract.rockPaperScissors(moveValue, {
            value: betAmountWei
        });

        action_msg.innerHTML = "Confirming...";
        const receipt = await tx.wait();

        const event = receipt.events.find(e => e.event === 'RockPaperScissorsResult');

        if (event) {
            const [player, betAmount, playerMove, computerMove, result, payout] = event.args;

            const computerChoice = computerMove === 0 ? 'r' : computerMove === 1 ? 'p' : 's';
            const betAmountBNB = parseFloat(ethers.utils.formatEther(betAmount));
            const payoutBNB = parseFloat(ethers.utils.formatEther(payout));
            
            // Determine game outcome
            let gameResult;
            if (result === 1) {
                win(userChoice, computerChoice);
                gameResult = 'win';
                action_msg.innerHTML = `You won! Reward: ${payoutBNB.toFixed(4)} tBNB`;
            } else if (result === -1) {
                lose(userChoice, computerChoice);
                gameResult = 'loss';
                action_msg.innerHTML = `You lost. Bet: ${betAmountBNB.toFixed(4)} tBNB`;
            } else {
                draw(userChoice, computerChoice);
                gameResult = 'draw';
                action_msg.innerHTML = "Draw! Bet returned.";
            }
            
            // Add to history
            addGameToHistory(
                gameHistory.length + 1,
                userChoice,
                computerChoice,
                betAmountBNB,
                gameResult,
                payoutBNB
            );
        } else {
            action_msg.innerHTML = "Transaction completed.";
        }

    } catch (error) {
        console.error("Game error:", error);

        if (error.message.includes("insufficient funds")) {
            action_msg.innerHTML = "Not enough funds.";
        } else if (error.message.includes("user rejected transaction")) {
            action_msg.innerHTML = "Transaction rejected.";
        } else {
            action_msg.innerHTML = "Transaction failed.";
        }
    } finally {
        setChoicesEnabled(true);
        isProcessing = false;
    }
}

function setChoicesEnabled(enabled) {
    const choices = document.querySelectorAll('.choice');
    choices.forEach(choice => {
        choice.style.pointerEvents = enabled ? 'auto' : 'none';
        choice.style.opacity = enabled ? '1' : '0.5';
    });
}

function initApp() {
    connectBtn.addEventListener("click", connectWallet);

    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
        checkConnection();

        window.ethereum.on('accountsChanged', function (accounts) {
            if (accounts.length === 0) {
                disconnectWallet();
            } else {
                initializeContract(accounts[0]);
            }
        });
    } else {
        action_msg.innerHTML = "Please install MetaMask to use this dApp!";
        connectBtn.disabled = true;
    }

    main();
}

async function checkConnection() {
    try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            await initializeContract(accounts[0]);
        }
    } catch (error) {
        console.log('No existing connection:', error);
    }
}

async function connectWallet() {
    if (window.ethereum) {
        try {
            connectBtn.disabled = true;
            connectBtn.textContent = "Connecting...";

            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            await initializeContract(accounts[0]);

        } catch (error) {
            console.error('Wallet connection error:', error);
            if (error.code === 4001) {
                action_msg.innerHTML = "Please connect your wallet to play.";
            } else {
                action_msg.innerHTML = "Wallet connection error: " + error.message;
            }
            connectBtn.disabled = false;
            connectBtn.textContent = "Connect Wallet";
        }
    } else {
        action_msg.innerHTML = "Please install MetaMask or another Ethereum wallet.";
    }
}

async function initializeContract(accountAddress) {
    try {
        account = accountAddress;

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();

        contract = new ethers.Contract(contractAddress, contractABI, signer);

        try {
            const minBetWei = await contract.minBet();
            const maxBetWei = await contract.maxBet();

            betAmountInput.min = ethers.utils.formatEther(minBetWei);
            betAmountInput.max = ethers.utils.formatEther(maxBetWei);
            betAmountInput.value = ethers.utils.formatEther(minBetWei);

            const betInfo = document.querySelector('.bet-info small');
            if (betInfo) {
                betInfo.textContent = `Min: ${ethers.utils.formatEther(minBetWei)} tBNB | Max: ${ethers.utils.formatEther(maxBetWei)} tBNB`;
            }
        } catch (error) {
            console.error("Error fetching contract limits:", error);
        }

        const shortenedAddress = account.substring(0, 6) + '...' + account.substring(account.length - 4);
        connectBtn.textContent = `Connected: ${shortenedAddress}`;
        connectBtn.disabled = false;

        document.body.classList.add('wallet-connected');
        betAmountInput.disabled = false;

        action_msg.innerHTML = "Wallet connected! Enter your bet and make your move.";

        console.log("Contract initialized successfully");

    } catch (error) {
        console.error('Contract initialization error:', error);
        action_msg.innerHTML = "Error initializing contract: " + error.message;
        connectBtn.disabled = false;
        connectBtn.textContent = "Connect Wallet";
        betAmountInput.disabled = true;
    }
}

function main() {
    rock_div.addEventListener('click', function () {
        game('r');
    });

    paper_div.addEventListener('click', function () {
        game('p');
    });

    scissors_div.addEventListener('click', function () {
        game('s');
    });

    betAmountInput.addEventListener('input', function () {
        const value = parseFloat(this.value);
        const min = parseFloat(this.min);
        const max = parseFloat(this.max);

        if (value < min) {
            this.value = min;
        } else if (value > max) {
            this.value = max;
        }
    });
    
    // Initialize display
    updateWinrateDisplay();
    updateHistoryList();
}