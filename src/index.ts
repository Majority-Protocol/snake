export const snakeGameHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <title>Snake Rounds</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body {
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #fff;
            touch-action: none;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            user-select: none;
        }
        #canvas {
            display: block;
            width: 100vw;
            height: 100vh;
        }
        #header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            padding: 8px 16px;
            padding-top: 55px;
            background: rgba(0,0,0,0.8);
            z-index: 10;
        }
        .header-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6px;
        }
        .header-row:last-child {
            margin-bottom: 0;
        }
        .header-left {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-left: 45px;
        }
        .header-right {
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .header-center {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .stat-label {
            font-size: 11px;
            color: rgba(255,255,255,0.5);
            text-transform: uppercase;
        }
        .stat-val {
            font-size: 16px;
            font-weight: 700;
            color: #fff;
        }
        .stat-timer {
            font-size: 28px;
            font-weight: 700;
            color: #2ecc71;
        }
        .stat-timer.warning { color: #f39c12; }
        .stat-timer.danger { color: #e74c3c; animation: pulse 0.5s infinite; }
        .stat-speed {
            font-size: 11px;
            color: rgba(255,255,255,0.6);
            text-transform: uppercase;
            padding: 2px 8px;
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
        }
        .stat-pill {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 13px;
            font-weight: 600;
            color: #fff;
            background: rgba(255,255,255,0.1);
            padding: 4px 10px;
            border-radius: 12px;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        #howToPlay {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #2d3436 0%, #1a1a2e 100%);
            padding: 30px 25px;
            border-radius: 24px;
            text-align: center;
            z-index: 30;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.1);
            max-width: 320px;
            width: 90%;
            display: none;
        }
        #howToPlay h2 {
            font-size: 28px;
            margin-bottom: 20px;
            background: linear-gradient(135deg, #2ecc71, #27ae60);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .instructions {
            text-align: left;
            margin-bottom: 24px;
        }
        .instruction-item {
            display: flex;
            align-items: center;
            gap: 12px;
            margin: 10px 0;
            font-size: 14px;
            color: rgba(255,255,255,0.85);
        }
        .instruction-icon {
            width: 28px;
            height: 28px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            flex-shrink: 0;
        }
        .icon-coconut { background: #8B4513; border-radius: 50%; }
        .icon-speed { background: linear-gradient(135deg, #2ecc71, #27ae60); border-radius: 50%; }
        .icon-ultra { background: linear-gradient(135deg, #3498db, #2980b9); border-radius: 50%; }
        .icon-ice { background: linear-gradient(135deg, #74b9ff, #0984e3); }
        .icon-coin { background: linear-gradient(135deg, #f1c40f, #f39c12); border-radius: 50%; }
        .icon-barrier { background: linear-gradient(135deg, #e74c3c, #c0392b); }
        #howToPlay button {
            background: linear-gradient(135deg, #2ecc71, #27ae60);
            border: none;
            color: #fff;
            padding: 16px 48px;
            font-size: 18px;
            font-weight: 700;
            border-radius: 30px;
            cursor: pointer;
            box-shadow: 0 8px 24px rgba(46, 204, 113, 0.4);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        #howToPlay button:active {
            transform: scale(0.95);
        }
        #message {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #2d3436 0%, #1a1a2e 100%);
            padding: 30px;
            border-radius: 24px;
            text-align: center;
            z-index: 30;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.1);
            display: none;
        }
        #message h2 { font-size: 24px; margin-bottom: 10px; }
        #message p { color: rgba(255,255,255,0.7); margin-bottom: 20px; }
        #message button {
            background: linear-gradient(135deg, #f39c12, #e67e22);
            border: none;
            color: #fff;
            padding: 14px 40px;
            font-size: 16px;
            font-weight: 700;
            border-radius: 25px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div id="header">
        <div class="header-row">
            <div class="header-left">
                <span class="stat-label">R</span>
                <span class="stat-val" id="round">1</span>
            </div>
            <div class="header-center">
                <div class="stat-timer" id="timer">60</div>
                <div class="stat-speed" id="speed">NORMAL</div>
            </div>
            <div class="header-right">
                <span class="stat-val">🐍 <span id="length">3</span>/<span id="target">11</span></span>
            </div>
        </div>
        <div class="header-row">
            <div class="header-left">
                <span class="stat-pill">💰 <span id="coins">0</span>/50</span>
            </div>
            <div class="header-right">
                <span class="stat-pill">❤️ <span id="lives">0</span></span>
            </div>
        </div>
    </div>
    <canvas id="canvas"></canvas>
    <div id="howToPlay">
        <h2>🐍 Snake Rounds</h2>
        <div class="instructions">
            <div class="instruction-item"><span class="instruction-icon icon-coconut">🥥</span> Brown = Grow (normal)</div>
            <div class="instruction-item"><span class="instruction-icon icon-speed">⚡</span> Green = Speed boost</div>
            <div class="instruction-item"><span class="instruction-icon icon-ultra">💎</span> Blue = EXTREME speed</div>
            <div class="instruction-item"><span class="instruction-icon icon-ice">❄️</span> Ice = Slow down</div>
            <div class="instruction-item"><span class="instruction-icon icon-coin">💰</span> Coins = 50 for extra life</div>
            <div class="instruction-item"><span class="instruction-icon icon-barrier">⛔</span> Barriers = Avoid! (Round 2+)</div>
        </div>
        <button onclick="startGame()">START GAME</button>
    </div>
    <div id="message">
        <h2 id="msg-title">Round Complete!</h2>
        <p id="msg-text">Get ready for the next round</p>
        <button onclick="nextAction()">Continue</button>
    </div>

    <script>
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');

        var GRID, COLS, ROWS, TOP_OFFSET, BOTTOM_OFFSET;
        var snake, direction, nextDirection, food, barriers;
        var round, targetLength, gameOver, roundComplete, gameLoop;
        var gameSpeed, baseSpeed, foodType, icePowerUp;
        var coins, lives, fallingCoins;
        var roundTimer, roundTimeLimit, timerInterval;
        var gameStarted = false;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            GRID = Math.floor(Math.min(canvas.width, canvas.height) / 20);
            TOP_OFFSET = Math.ceil(130 / GRID);
            BOTTOM_OFFSET = Math.ceil(40 / GRID);
            COLS = Math.floor(canvas.width / GRID);
            ROWS = Math.floor(canvas.height / GRID) - TOP_OFFSET - BOTTOM_OFFSET;
            if (snake && snake.length > 0) draw();
        }
        window.addEventListener('resize', resize);
        resize();

        function init() {
            document.getElementById('howToPlay').style.display = 'block';
        }

        function startGame() {
            document.getElementById('howToPlay').style.display = 'none';
            gameStarted = true;
            round = 1;
            coins = 0;
            lives = 0;
            fallingCoins = [];
            startRound();
        }

        function startRound() {
            var startLength = round === 1 ? 3 : snake.length;
            snake = [];
            var startX = Math.floor(COLS / 2);
            var startY = Math.floor(ROWS / 2);
            for (var i = 0; i < startLength; i++) {
                snake.push({ x: startX - i, y: startY });
            }
            direction = { x: 1, y: 0 };
            nextDirection = { x: 1, y: 0 };
            targetLength = startLength + 5 + (round * 3);
            barriers = generateBarriers();
            gameOver = false;
            roundComplete = false;
            baseSpeed = 100;
            gameSpeed = baseSpeed;
            icePowerUp = null;
            roundTimeLimit = Math.max(30, 60 - (round - 1) * 5);
            roundTimer = roundTimeLimit;
            startTimer();
            placeFood();
            updateUI();
            startGameLoop();
        }

        function startTimer() {
            if (timerInterval) clearInterval(timerInterval);
            timerInterval = setInterval(function() {
                if (gameOver || roundComplete) return;
                roundTimer--;
                updateUI();
                if (roundTimer <= 0) timeUp();
            }, 1000);
        }

        function timeUp() {
            if (lives > 0) {
                lives--;
                roundTimer = roundTimeLimit;
                updateUI();
                return;
            }
            gameOver = true;
            clearInterval(gameLoop);
            clearInterval(timerInterval);
            showMessage("Time's Up!", 'Round ' + round + ' • Length ' + snake.length, 'Try Again');
        }

        function startGameLoop() {
            if (gameLoop) clearInterval(gameLoop);
            gameLoop = setInterval(update, gameSpeed);
        }

        function changeSpeed(newSpeed) {
            gameSpeed = Math.max(40, Math.min(150, newSpeed));
            startGameLoop();
            updateUI();
        }

        function generateBarriers() {
            var b = [];
            if (round < 2) return b;
            var numBarriers = Math.min(1 + round * 2, 12);
            var snakeStartX = Math.floor(COLS / 2);
            var snakeStartY = Math.floor(ROWS / 2);

            for (var i = 0; i < numBarriers; i++) {
                var isHorizontal = Math.random() > 0.5;
                var length = 3 + Math.floor(Math.random() * (round + 2));
                var startX = Math.floor(Math.random() * (COLS - length - 4)) + 2;
                var startY = Math.floor(Math.random() * (ROWS - length - 4)) + 2;

                for (var j = 0; j < length; j++) {
                    var bx = isHorizontal ? startX + j : startX;
                    var by = isHorizontal ? startY : startY + j;
                    if (Math.abs(bx - snakeStartX) > 5 || Math.abs(by - snakeStartY) > 3) {
                        b.push({ x: bx, y: by });
                    }
                }
            }
            return b;
        }

        function placeFood() {
            var valid = false;
            var attempts = 0;
            while (!valid && attempts < 1000) {
                food = {
                    x: Math.floor(Math.random() * COLS),
                    y: Math.floor(Math.random() * ROWS)
                };
                valid = !snake.some(function(s) { return s.x === food.x && s.y === food.y; }) &&
                        !barriers.some(function(b) { return b.x === food.x && b.y === food.y; });
                attempts++;
            }
            var roll = Math.random();
            if (roll < 0.15) foodType = 'ultra';
            else if (roll < 0.40) foodType = 'speed';
            else foodType = 'normal';

            if (!icePowerUp && Math.random() < 0.25) {
                placeIcePowerUp();
            }
        }

        function placeIcePowerUp() {
            var valid = false;
            var attempts = 0;
            while (!valid && attempts < 500) {
                icePowerUp = {
                    x: Math.floor(Math.random() * COLS),
                    y: Math.floor(Math.random() * ROWS)
                };
                valid = !snake.some(function(s) { return s.x === icePowerUp.x && s.y === icePowerUp.y; }) &&
                        !barriers.some(function(b) { return b.x === icePowerUp.x && b.y === icePowerUp.y; }) &&
                        !(food.x === icePowerUp.x && food.y === icePowerUp.y);
                attempts++;
            }
        }

        function spawnCoin() {
            fallingCoins.push({
                x: Math.floor(Math.random() * COLS),
                y: 0,
                fallProgress: 0
            });
        }

        function update() {
            if (gameOver || roundComplete) return;

            if (Math.random() < 0.03) spawnCoin();

            fallingCoins.forEach(function(c) { c.fallProgress += 0.2; });
            fallingCoins = fallingCoins.filter(function(c) { return c.fallProgress < ROWS; });

            var head = snake[0];
            var newCoins = [];
            fallingCoins.forEach(function(coin) {
                var coinY = Math.floor(coin.fallProgress);
                if (coin.x === head.x && Math.abs(coinY - head.y) <= 1) {
                    coins++;
                    if (coins >= 50) { coins -= 50; lives++; }
                    updateUI();
                } else {
                    newCoins.push(coin);
                }
            });
            fallingCoins = newCoins;

            direction = nextDirection;
            var newHead = { x: head.x + direction.x, y: head.y + direction.y };

            if (newHead.x < 0 || newHead.x >= COLS || newHead.y < 0 || newHead.y >= ROWS) {
                endGame(); return;
            }
            if (snake.some(function(s) { return s.x === newHead.x && s.y === newHead.y; })) {
                endGame(); return;
            }
            if (barriers.some(function(b) { return b.x === newHead.x && b.y === newHead.y; })) {
                endGame(); return;
            }

            snake.unshift(newHead);

            if (icePowerUp && newHead.x === icePowerUp.x && newHead.y === icePowerUp.y) {
                changeSpeed(gameSpeed + 25);
                icePowerUp = null;
            }

            if (newHead.x === food.x && newHead.y === food.y) {
                if (foodType === 'ultra') changeSpeed(gameSpeed - 30);
                else if (foodType === 'speed') changeSpeed(gameSpeed - 15);
                placeFood();
                if (snake.length >= targetLength) completeRound();
            } else {
                snake.pop();
            }

            updateUI();
            draw();
        }

        var animFrame = 0;
        function draw() {
            animFrame++;
            var yOffset = TOP_OFFSET * GRID;
            var pulse = Math.sin(animFrame * 0.1) * 0.5 + 0.5;

            // Background gradient
            var gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#0f0f23');
            gradient.addColorStop(0.5, '#1a1a3e');
            gradient.addColorStop(1, '#0d1b2a');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Game area border
            var gameAreaX = 0;
            var gameAreaY = yOffset;
            var gameAreaW = COLS * GRID;
            var gameAreaH = ROWS * GRID;
            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            ctx.lineWidth = 2;
            ctx.strokeRect(gameAreaX + 1, gameAreaY + 1, gameAreaW - 2, gameAreaH - 2);
            // Glowing edge effect
            ctx.shadowColor = '#00ffff';
            ctx.shadowBlur = 10;
            ctx.strokeStyle = 'rgba(0,255,255,0.2)';
            ctx.strokeRect(gameAreaX + 1, gameAreaY + 1, gameAreaW - 2, gameAreaH - 2);
            ctx.shadowBlur = 0;

            // Barriers - glowing red crystals
            barriers.forEach(function(b) {
                var bx = b.x * GRID + GRID/2;
                var by = yOffset + b.y * GRID + GRID/2;
                var bGrad = ctx.createRadialGradient(bx, by, 0, bx, by, GRID/2);
                bGrad.addColorStop(0, '#ff6b6b');
                bGrad.addColorStop(0.6, '#e74c3c');
                bGrad.addColorStop(1, '#c0392b');
                ctx.fillStyle = bGrad;
                ctx.shadowColor = '#ff0000';
                ctx.shadowBlur = 8 + pulse * 4;
                ctx.beginPath();
                ctx.moveTo(bx, by - GRID/2 + 3);
                ctx.lineTo(bx + GRID/2 - 3, by);
                ctx.lineTo(bx, by + GRID/2 - 3);
                ctx.lineTo(bx - GRID/2 + 3, by);
                ctx.closePath();
                ctx.fill();
                ctx.shadowBlur = 0;
            });

            // Snake body with gradient and glow
            for (var i = snake.length - 1; i >= 0; i--) {
                var seg = snake[i];
                var segX = seg.x * GRID + GRID/2;
                var segY = yOffset + seg.y * GRID + GRID/2;
                var progress = i / snake.length;
                var radius = GRID/2 - 1 - (progress * 3);

                // Body gradient - cyan to purple
                var snakeGrad = ctx.createRadialGradient(segX - 2, segY - 2, 0, segX, segY, radius);
                if (i === 0) {
                    snakeGrad.addColorStop(0, '#00ff88');
                    snakeGrad.addColorStop(0.5, '#00d4aa');
                    snakeGrad.addColorStop(1, '#00a080');
                    ctx.shadowColor = '#00ff88';
                    ctx.shadowBlur = 20;
                } else {
                    var hue = 160 + progress * 40;
                    var sat = 80 - progress * 30;
                    var light = 55 - progress * 20;
                    snakeGrad.addColorStop(0, 'hsl(' + hue + ',' + sat + '%,' + (light + 15) + '%)');
                    snakeGrad.addColorStop(1, 'hsl(' + hue + ',' + sat + '%,' + light + '%)');
                    ctx.shadowBlur = 0;
                }

                ctx.fillStyle = snakeGrad;
                ctx.beginPath();
                ctx.arc(segX, segY, radius, 0, Math.PI * 2);
                ctx.fill();

                // Shine effect
                if (i < snake.length / 3) {
                    ctx.fillStyle = 'rgba(255,255,255,0.3)';
                    ctx.beginPath();
                    ctx.arc(segX - radius/3, segY - radius/3, radius/4, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.shadowBlur = 0;

                // Snake head details
                if (i === 0) {
                    var eyeOff = GRID / 4;
                    var eyeX1 = segX - eyeOff + direction.x * 4;
                    var eyeY1 = segY - eyeOff * direction.x + direction.y * 4;
                    var eyeX2 = segX + eyeOff + direction.x * 4;
                    var eyeY2 = segY + eyeOff * direction.x + direction.y * 4;
                    if (direction.y !== 0) {
                        eyeX1 = segX - eyeOff;
                        eyeX2 = segX + eyeOff;
                        eyeY1 = segY + direction.y * 3;
                        eyeY2 = segY + direction.y * 3;
                    }
                    // Eye whites
                    ctx.fillStyle = '#fff';
                    ctx.beginPath();
                    ctx.arc(eyeX1, eyeY1, 5, 0, Math.PI * 2);
                    ctx.arc(eyeX2, eyeY2, 5, 0, Math.PI * 2);
                    ctx.fill();
                    // Pupils
                    ctx.fillStyle = '#000';
                    ctx.beginPath();
                    ctx.arc(eyeX1 + direction.x, eyeY1 + direction.y, 2.5, 0, Math.PI * 2);
                    ctx.arc(eyeX2 + direction.x, eyeY2 + direction.y, 2.5, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // Food - different styles based on type
            var fx = food.x * GRID + GRID/2;
            var fy = yOffset + food.y * GRID + GRID/2;
            var fr = GRID/2 - 2 + pulse * 2;

            if (foodType === 'ultra') {
                // Diamond/crystal effect
                var ultraGrad = ctx.createRadialGradient(fx, fy, 0, fx, fy, fr);
                ultraGrad.addColorStop(0, '#00ffff');
                ultraGrad.addColorStop(0.5, '#0099ff');
                ultraGrad.addColorStop(1, '#0066cc');
                ctx.fillStyle = ultraGrad;
                ctx.shadowColor = '#00ffff';
                ctx.shadowBlur = 25 + pulse * 10;
                ctx.beginPath();
                ctx.moveTo(fx, fy - fr);
                ctx.lineTo(fx + fr, fy);
                ctx.lineTo(fx, fy + fr);
                ctx.lineTo(fx - fr, fy);
                ctx.closePath();
                ctx.fill();
                // Inner shine
                ctx.fillStyle = 'rgba(255,255,255,0.5)';
                ctx.beginPath();
                ctx.moveTo(fx, fy - fr/2);
                ctx.lineTo(fx + fr/3, fy);
                ctx.lineTo(fx, fy + fr/3);
                ctx.lineTo(fx - fr/3, fy);
                ctx.closePath();
                ctx.fill();
            } else if (foodType === 'speed') {
                // Purple energy orb
                var speedGrad = ctx.createRadialGradient(fx, fy, 0, fx, fy, fr);
                speedGrad.addColorStop(0, '#ff66ff');
                speedGrad.addColorStop(0.5, '#cc33ff');
                speedGrad.addColorStop(1, '#9900cc');
                ctx.fillStyle = speedGrad;
                ctx.shadowColor = '#cc33ff';
                ctx.shadowBlur = 20 + pulse * 8;
                ctx.beginPath();
                ctx.arc(fx, fy, fr, 0, Math.PI * 2);
                ctx.fill();
                // Lightning symbol
                ctx.fillStyle = '#fff';
                ctx.font = 'bold ' + (GRID * 0.6) + 'px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('⚡', fx, fy);
            } else {
                // Apple/fruit style
                var foodGrad = ctx.createRadialGradient(fx - 3, fy - 3, 0, fx, fy, fr);
                foodGrad.addColorStop(0, '#ff6b6b');
                foodGrad.addColorStop(0.7, '#ee5253');
                foodGrad.addColorStop(1, '#b33939');
                ctx.fillStyle = foodGrad;
                ctx.shadowColor = '#ff0000';
                ctx.shadowBlur = 12;
                ctx.beginPath();
                ctx.arc(fx, fy, fr, 0, Math.PI * 2);
                ctx.fill();
                // Shine
                ctx.fillStyle = 'rgba(255,255,255,0.4)';
                ctx.beginPath();
                ctx.arc(fx - fr/3, fy - fr/3, fr/3, 0, Math.PI * 2);
                ctx.fill();
                // Stem
                ctx.fillStyle = '#27ae60';
                ctx.fillRect(fx - 2, fy - fr - 4, 4, 6);
            }
            ctx.shadowBlur = 0;

            // Ice power-up - snowflake crystal
            if (icePowerUp) {
                var ix = icePowerUp.x * GRID + GRID/2;
                var iy = yOffset + icePowerUp.y * GRID + GRID/2;
                var ir = GRID/2;
                var iceGrad = ctx.createRadialGradient(ix, iy, 0, ix, iy, ir);
                iceGrad.addColorStop(0, '#ffffff');
                iceGrad.addColorStop(0.5, '#74b9ff');
                iceGrad.addColorStop(1, '#0984e3');
                ctx.fillStyle = iceGrad;
                ctx.shadowColor = '#74b9ff';
                ctx.shadowBlur = 15 + pulse * 5;
                // Hexagon shape
                ctx.beginPath();
                for (var hi = 0; hi < 6; hi++) {
                    var angle = (hi * Math.PI / 3) - Math.PI / 2;
                    var hx = ix + Math.cos(angle) * (ir - 2);
                    var hy = iy + Math.sin(angle) * (ir - 2);
                    if (hi === 0) ctx.moveTo(hx, hy);
                    else ctx.lineTo(hx, hy);
                }
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.font = (GRID * 0.5) + 'px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('❄', ix, iy);
                ctx.shadowBlur = 0;
            }

            // Falling coins - spinning gold coins
            fallingCoins.forEach(function(coin) {
                var coinX = coin.x * GRID + GRID/2;
                var coinY = yOffset + coin.fallProgress * GRID + GRID/2;
                var coinR = GRID/3;
                var spin = Math.abs(Math.sin(animFrame * 0.15 + coin.x));
                var coinGrad = ctx.createRadialGradient(coinX - 2, coinY - 2, 0, coinX, coinY, coinR);
                coinGrad.addColorStop(0, '#fff7a1');
                coinGrad.addColorStop(0.5, '#ffd700');
                coinGrad.addColorStop(1, '#b8860b');
                ctx.fillStyle = coinGrad;
                ctx.shadowColor = '#ffd700';
                ctx.shadowBlur = 12;
                ctx.beginPath();
                ctx.ellipse(coinX, coinY, coinR * spin, coinR, 0, 0, Math.PI * 2);
                ctx.fill();
                if (spin > 0.3) {
                    ctx.fillStyle = '#b8860b';
                    ctx.font = 'bold ' + (coinR) + 'px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('$', coinX, coinY + 1);
                }
                ctx.shadowBlur = 0;
            });
        }

        function updateUI() {
            document.getElementById('round').textContent = round;
            document.getElementById('length').textContent = snake.length;
            document.getElementById('target').textContent = targetLength;
            document.getElementById('coins').textContent = coins;
            document.getElementById('lives').textContent = lives;
            document.getElementById('timer').textContent = roundTimer;

            var timerEl = document.getElementById('timer');
            timerEl.className = 'stat-timer';
            if (roundTimer <= 10) timerEl.className += ' danger';
            else if (roundTimer <= 20) timerEl.className += ' warning';

            var speedLabel = 'NORMAL';
            if (gameSpeed <= 55) speedLabel = 'INSANE';
            else if (gameSpeed <= 70) speedLabel = 'FAST';
            else if (gameSpeed <= 85) speedLabel = 'QUICK';
            else if (gameSpeed >= 125) speedLabel = 'SLOW';
            document.getElementById('speed').textContent = speedLabel;
        }

        function completeRound() {
            roundComplete = true;
            clearInterval(gameLoop);
            clearInterval(timerInterval);
            showMessage('Round ' + round + ' Complete!', 'Length: ' + snake.length + ' • Next target: ' + (snake.length + 5 + ((round + 1) * 3)), 'Next Round');
        }

        function endGame() {
            if (lives > 0) {
                lives--;
                respawn();
                return;
            }
            gameOver = true;
            clearInterval(gameLoop);
            clearInterval(timerInterval);
            showMessage('Game Over!', 'Round ' + round + ' • Final length: ' + snake.length, 'Play Again');
        }

        function respawn() {
            var currentLength = snake.length;
            snake = [];
            var startX = Math.floor(COLS / 2);
            var startY = Math.floor(ROWS / 2);
            for (var i = 0; i < currentLength; i++) {
                snake.push({ x: startX - i, y: startY });
            }
            direction = { x: 1, y: 0 };
            nextDirection = { x: 1, y: 0 };
            updateUI();
        }

        function showMessage(title, text, btnText) {
            document.getElementById('msg-title').textContent = title;
            document.getElementById('msg-text').textContent = text;
            document.getElementById('message').querySelector('button').textContent = btnText;
            document.getElementById('message').style.display = 'block';
        }

        function nextAction() {
            document.getElementById('message').style.display = 'none';
            if (gameOver) {
                round = 1;
                snake = [];
                coins = 0;
                lives = 0;
                fallingCoins = [];
            } else {
                round++;
            }
            startRound();
        }

        // Touch controls
        var touchStartX = 0, touchStartY = 0, touchStartTime = 0;

        canvas.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
            e.preventDefault();
        }, { passive: false });

        canvas.addEventListener('touchend', function(e) {
            if (!gameStarted || gameOver || roundComplete) return;
            var dx = e.changedTouches[0].clientX - touchStartX;
            var dy = e.changedTouches[0].clientY - touchStartY;
            var duration = Date.now() - touchStartTime;

            if (duration < 400 && (Math.abs(dx) > 20 || Math.abs(dy) > 20)) {
                var newDir = null;
                if (Math.abs(dx) > Math.abs(dy)) {
                    if (dx > 0 && direction.x !== -1) newDir = {x: 1, y: 0};
                    else if (dx < 0 && direction.x !== 1) newDir = {x: -1, y: 0};
                } else {
                    if (dy > 0 && direction.y !== -1) newDir = {x: 0, y: 1};
                    else if (dy < 0 && direction.y !== 1) newDir = {x: 0, y: -1};
                }
                if (newDir) {
                    nextDirection = newDir;
                    update();
                    startGameLoop();
                }
            }
        }, { passive: false });

        document.addEventListener('keydown', function(e) {
            if (!gameStarted || gameOver || roundComplete) return;
            var newDir = null;
            if (e.key === 'ArrowUp' && direction.y !== 1) newDir = {x: 0, y: -1};
            if (e.key === 'ArrowDown' && direction.y !== -1) newDir = {x: 0, y: 1};
            if (e.key === 'ArrowLeft' && direction.x !== 1) newDir = {x: -1, y: 0};
            if (e.key === 'ArrowRight' && direction.x !== -1) newDir = {x: 1, y: 0};
            if (newDir) {
                nextDirection = newDir;
                update();
                startGameLoop();
            }
            e.preventDefault();
        });

        init();
    </script>
</body>
</html>
`;
