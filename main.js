document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    const player = document.getElementById('player');

    let direction;
    let playerSpeed = 25;
    

    let segments = [];
    let segmentPositions = [];

    let headPosX = 400;
    let headPosY = 300;

    let apple = null;
    let applePosX;
    let applePosY;

    let score = 0;
    const scoreElement = document.querySelector('.score');

    function resetGame() {

        segments.forEach(segment => {
            if (segment && segment.parentNode) {
                segment.parentNode.removeChild(segment);
            }
        });
        
        if (apple && apple.parentNode) {
            apple.parentNode.removeChild(apple);
        }

        score = 0;
        if (scoreElement) scoreElement.textContent = `Score: 0`;
        
        segments = [];
        segmentPositions = [];
        
        headPosX = 400;
        headPosY = 300;
        
        direction = null;
        
        apple = null;
        
        initPlayer();
    }

    function initPlayer() {
        for (let i = 0; i < 3; i++) {
            const segment = document.createElement('div');
            segment.className = 'player-segment';
            segment.style.height = '25px';
            segment.style.width = '25px';
            segment.style.backgroundColor = i === 0 ? 'green' : 'lightgreen';
            segment.style.position = 'absolute';
            segment.style.borderRadius = i === 0 ? '5px' : '3px';
            
            segment.style.left = (headPosX - i * 25) + 'px';
            segment.style.top = headPosY + 'px';
            
            app.appendChild(segment);
            segments.push(segment);
            segmentPositions.push({ x: headPosX - i * 25, y: headPosY });
        }
    }

    document.addEventListener('keydown', (e) => {
        if ((e.key === 'w' || e.key === 'ArrowUp') && direction != 'down') {
            direction = 'up';
            e.preventDefault();
        } else if ((e.key === 's' || e.key === 'ArrowDown') && direction != 'up') {
            direction = 'down';
            e.preventDefault();
        } else if ((e.key === 'a' || e.key === 'ArrowLeft') && direction != 'right') {
            direction = 'left';
            e.preventDefault();
        } else if ((e.key === 'd' || e.key === 'ArrowRight') && direction != 'left') {
            direction = 'right';
            e.preventDefault();
        }
    });

    function update() {
        setInterval(() => {
            if (!direction) return;

            const oldPositions = segmentPositions.map(pos => ({ ...pos }));

            if (direction === 'up') {
                headPosY -= playerSpeed;
            } else if (direction === 'down') {
                headPosY += playerSpeed;
            } else if (direction === 'left') {
                headPosX -= playerSpeed;
            } else if (direction === 'right') {
                headPosX += playerSpeed;
            }

            segmentPositions[0] = { x: headPosX, y: headPosY };
            segments[0].style.left = headPosX + 'px';
            segments[0].style.top = headPosY + 'px';

            for (let i = 1; i < segments.length; i++) {
                segmentPositions[i] = { ...oldPositions[i - 1] };
                segments[i].style.left = segmentPositions[i].x + 'px';
                segments[i].style.top = segmentPositions[i].y + 'px';
            }

            checkBoundaries();
            checkCollisions();
            checkSelfCollision();

        }, 200);
    }

    function checkBoundaries() {
        if (headPosX < 0 || headPosX > 775 || headPosY < 0 || headPosY > 575) {
            resetGame();
        }
    }

    function addSegment() {
        const lastSegmentPos = segmentPositions[segmentPositions.length - 1];
        
        const newSegment = document.createElement('div');
        newSegment.className = 'player-segment';
        newSegment.style.height = '25px';
        newSegment.style.width = '25px';
        newSegment.style.backgroundColor = 'lightgreen';
        newSegment.style.position = 'absolute';
        newSegment.style.borderRadius = '3px';
        newSegment.style.left = lastSegmentPos.x + 'px';
        newSegment.style.top = lastSegmentPos.y + 'px';
        
        app.appendChild(newSegment);
        segments.push(newSegment);
        segmentPositions.push({ ...lastSegmentPos });

        newSegment.style.transform = 'scale(0)';
        setTimeout(() => {
            newSegment.style.transition = 'transform 0.2s ease-out';
            newSegment.style.transform = 'scale(1)';
        }, 10);
    }

    function spawnApple() {
        setInterval(() => {
            if (!apple) {
                applePosX = generateRandomMultipleOf25Short800();
                applePosY = generateRandomMultipleOf25Short600();
                createApple();
            }
        }, 1000);
    }
    
    function createApple() {
        apple = document.createElement('div');
        apple.className = 'apple';
        apple.style.height = '25px';
        apple.style.width = '25px';
        apple.style.backgroundColor = 'red';
        apple.style.position = 'absolute';
        apple.style.borderRadius = '50%';
        apple.style.top = applePosY + 'px';
        apple.style.left = applePosX + 'px';
        
        app.appendChild(apple);
    }

    function checkCollisions() {
        if (apple && checkCollisionPlayer(apple, segments[0])) {
            console.log('Яблоко съедено! Добавляем сегмент');
            app.removeChild(apple);
            apple = null;
            addSegment();
            score += 10;
            if (scoreElement) scoreElement.textContent = `Score: ${score}`;
        }
    }

    function checkSelfCollision() {
        for (let i = 4; i < segments.length; i++) {
            if (segmentPositions[0].x === segmentPositions[i].x && 
                segmentPositions[0].y === segmentPositions[i].y) {
                resetGame();
            }
        }
    }

    function checkCollisionPlayer(appleCol, playerCol) {
        if (!appleCol || !playerCol) return false;
        
        const appleRect = appleCol.getBoundingClientRect();
        const playerRect = playerCol.getBoundingClientRect();
        
        return (
            appleRect.left < playerRect.right &&
            appleRect.right > playerRect.left &&
            appleRect.top < playerRect.bottom &&
            appleRect.bottom > playerRect.top
        );
    }

    function generateRandomMultipleOf25Short800() {
        return Math.floor(Math.random() * (800 / 25)) * 25;
    }
    
    function generateRandomMultipleOf25Short600() {
        return Math.floor(Math.random() * (600 / 25)) * 25;
    }

    initPlayer();
    update();
    spawnApple();
});