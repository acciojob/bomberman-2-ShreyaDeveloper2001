//your code here
const gridSize = 10;
        const bombCount = 10;
        const grid = document.getElementById('grid');
        const result = document.getElementById('result');
        const flagsLeft = document.getElementById('flagsLeft');
        let flagsPlaced = 0;
        let bomb = [];
        let revealed = [];
// Initialize the grid
        for (let i = 0; i < gridSize * gridSize; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell valid';
            cell.dataset.value = 0; // Number of bombs in the neighborhood
            cell.dataset.state = 'hidden'; // Cell state: hidden, revealed, flagged
            cell.id = i;
            cell.addEventListener('click', cellClick);
            cell.addEventListener('contextmenu', cellFlag);
            grid.appendChild(cell);
        }
// Randomly place bombs
        while (bomb.length < bombCount) {
            const bombIndex = Math.floor(Math.random() * gridSize * gridSize);
            if (!bomb.includes(bombIndex)) {
                bomb.push(bombIndex);
            }
        }

        // Event handler for left-clicking a cell
        function cellClick(event) {
            const cell = event.target;
            if (cell.dataset.state === 'hidden') {
                if (bomb.includes(Number(cell.id))) {
                    cell.classList.add('bomb');
                    result.innerText = 'YOU LOSE!';
                    return;
                }
				 cell.classList.add('checked');
                cell.dataset.state = 'revealed';
                const bombNeighbors = countBombNeighbors(Number(cell.id));
                cell.dataset.value = bombNeighbors;
                if (bombNeighbors === 0) {
                    revealNeighbors(Number(cell.id));
                }
                if (revealed.length + bombCount === gridSize * gridSize) {
                    result.innerText = 'YOU WIN!';
                }
            }
        }
// Event handler for right-clicking a cell
        function cellFlag(event) {
            event.preventDefault();
            const cell = event.target;
            if (cell.dataset.state === 'hidden' && flagsPlaced < bombCount) {
                cell.classList.add('flag');
                cell.dataset.state = 'flagged';
                flagsPlaced++;
                flagsLeft.innerText = bombCount - flagsPlaced;
            } else if (cell.dataset.state === 'flagged') {
                cell.classList.remove('flag');
                cell.dataset.state = 'hidden';
                flagsPlaced--;
                flagsLeft.innerText = bombCount - flagsPlaced;
            }
        }
// Count the number of bombs in the neighborhood of a cell
        function countBombNeighbors(cellIndex) {
            const neighbors = getNeighbors(cellIndex);
            return neighbors.filter(neighbor => bombs.includes(neighbor)).length;
        }

        // Get the neighboring cell indices
        function getNeighbors(cellIndex) {
            const neighbors = [];
            const row = Math.floor(cellIndex / gridSize);
            const col = cellIndex % gridSize;
			 for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const newRow = row + i;
                    const newCol = col + j;
                    if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
                        neighbors.push(newRow * gridSize + newCol);
                    }
                }
            }

            return neighbors;
        }
 // Recursively reveal neighboring cells with no bombs
        function revealNeighbors(cellIndex) {
            const neighbors = getNeighbors(cellIndex);
            for (const neighbor of neighbors) {
                const cell = document.getElementById(neighbor);
                if (cell.dataset.state === 'hidden') {
                    cellClick({ target: cell });
                }
            }
        }


