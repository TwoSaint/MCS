let collision = 0;
let itemCount = 0;
let speedMultiplier = 1;
let items = []; // To keep track of all items for collision detection
let collisionEnabled = false; // To control when collisions are enabled
let randomnessValue = 40;
let speedValue = 3.0;

// Update the randomnessValue based on slider input
const randomnessSlider = document.getElementById('randomnessSlider');
randomnessSlider.addEventListener('input', () => {
    randomnessValue = parseInt(randomnessSlider.value, 10);
});

const speedSlider = document.getElementById('speedSlider');
speedSlider.addEventListener('input', () => {
    speedValue = parseInt(speedSlider.value, 10);
});

// Function to create and animate bouncing items
function createTeam(teamClass) {
    const gameContainer = document.getElementById('gameContainer');
    const item = document.createElement('div');
    item.className = `item ${teamClass}`;
    gameContainer.appendChild(item);

    const margin = 50;
    let posX = Math.random() * (window.innerWidth - 2 * margin) + margin;
    let posY = Math.random() * (window.innerHeight - 2 * margin) + margin;

    let velX = (Math.random() - 0.5) * speedValue;
    let velY = (Math.random() - 0.5) * speedValue;

    let updateCount = 0; // Unique to each item
    const randomDelay = Math.random() * 500;

    function update() {
        if (updateCount % randomnessValue === 0) {
            velX = (Math.random() - 0.5) * speedValue;
            velY = (Math.random() - 0.5) * speedValue;
        }
        updateCount++;

        // Bounce off walls
        if (posX < 0 || posX > window.innerWidth - item.clientWidth) {
            velX = -velX;
            collision += 1;
        }
        if (posY < 0 || posY > window.innerHeight - item.clientHeight) {
            velY = -velY;
            collision += 1;
        }

        posX += velX * speedMultiplier;
        posY += velY * speedMultiplier;

        // Only check collisions when collision detection is enabled
        if (collisionEnabled) {
            for (let other of items) {
                if (other === item || !other.isConnected) continue; // Skip itself or removed items

                let otherPosX = parseFloat(other.style.left);
                let otherPosY = parseFloat(other.style.top);

                // Use more precise distance-based collision detection
                let dx = posX - otherPosX;
                let dy = posY - otherPosY;
                let distance = Math.sqrt(dx * dx + dy * dy);

                let itemRadius = item.clientWidth / 2;
                let otherRadius = other.clientWidth / 2;

                if (distance < itemRadius + otherRadius) {
                    handleCollision(item, other);
                }
            }
        }

        item.style.left = `${posX}px`;
        item.style.top = `${posY}px`;

        if (item.isConnected) { // Only keep updating if item is still in the DOM
            requestAnimationFrame(update);
        }
    }

    setTimeout(update, randomDelay);
    update();
    items.push(item); // Add this item to the list of items
}

// Function to handle the collision and determine the winner
function handleCollision(item1, item2) {
    const team1 = item1.classList[1]; // Get the team class of item1
    const team2 = item2.classList[1]; // Get the team class of item2

    let winner;

    switch (team1) {
        case 'rock':
            if (team2 === 'scissors') winner = item1;
            else if (team2 === 'paper') winner = item2;
            break;
        case 'paper':
            if (team2 === 'rock') winner = item1;
            else if (team2 === 'scissors') winner = item2;
            break;
        case 'scissors':
            if (team2 === 'paper') winner = item1;
            else if (team2 === 'rock') winner = item2;
            break;
    }

    if (winner) {
        const loser = winner === item1 ? item2 : item1;
        loser.className = `item ${winner.classList[1]}`; // Change team of loser
        loser.style.backgroundImage = winner.style.backgroundImage; // Update appearance
    }
}

// Function to update item count based on the slider
const countSlider = document.getElementById('countSlider');
countSlider.addEventListener('input', () => {
    const itemCount = parseInt(countSlider.value, 10);
    adjustItemsForTeam('scissors', itemCount);
    adjustItemsForTeam('rock', itemCount);
    adjustItemsForTeam('paper', itemCount);
});

// Function to adjust items for each team
function adjustItemsForTeam(teamClass, desiredCount) {
    const currentItems = items.filter(item => item.classList.contains(teamClass));

    if (currentItems.length < desiredCount) {
        // Add more items if needed
        for (let i = currentItems.length; i < desiredCount; i++) {
            createTeam(teamClass);
        }
    } else if (currentItems.length > desiredCount) {
        // Remove extra items if needed
        for (let i = 0; i < currentItems.length - desiredCount; i++) {
            const itemToRemove = currentItems[i];
            itemToRemove.remove(); // Remove from DOM
            items = items.filter(item => item !== itemToRemove); // Remove from array
        }
    }
}

// Initial population of items
const initialItemCount = parseInt(countSlider.value, 10);
adjustItemsForTeam('scissors', initialItemCount);
adjustItemsForTeam('rock', initialItemCount);
adjustItemsForTeam('paper', initialItemCount);

// Enable collisions and hide the slider when the "fight" button is clicked
document.getElementById('fightButton').addEventListener('click', function() {
    collisionEnabled = true;
    this.style.display = 'none'; // Hide the button after clicking

    // Disable and hide the count slider
    const countSlider = document.getElementById('countSlider');
    countSlider.disabled = true;
    countSlider.style.display = 'none'; // Optionally hide it as well
});
