// Initialisation de la scène, de la caméra et du rendu
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Création des objets du jeu
const paddleWidth = 10;
const paddleHeight = 40;
const paddleDepth = 10;
        const paddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth);
        const paddleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const playerPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
        const computerPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
        const ballGeometry = new THREE.SphereGeometry(5, 32, 32);
        const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const ball = new THREE.Mesh(ballGeometry, ballMaterial);

        // Variables de vitesse de la balle
        let ballSpeedX = 1.5;
        let ballSpeedY = 1.5;
        const acceleration = 1;
        // Variables de vitesse maximale de la balle
        const maxSpeedX = 5;
        const maxSpeedY = 5;

        // Variables de mouvement des raquettes
        let playerPaddleSpeed = 0.1;
        let computerPaddleSpeed = 0;

        // Variables de score
        let playerScore = 0;
        let computerScore = 0;

        // Positionnement des objets
        playerPaddle.position.set(-200, 0, 0);
        computerPaddle.position.set(200, 0, 0);
        ball.position.set(0, 0, 0);

        // Ajout des objets à la scène
        scene.add(playerPaddle);
        scene.add(computerPaddle);
        scene.add(ball);

        // Positionnement de la caméra
        camera.position.z = 200;
        
        // Création de la géométrie de la ligne en pointillés
        const lineGeometry = new THREE.PlaneGeometry(1, 180); // Création d'une surface fine pour la ligne

        // Création du matériau pour la ligne en pointillés
        const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1 });

        // Création de la ligne en pointillés
        const line = new THREE.Mesh(lineGeometry, lineMaterial);

        // Positionnement de la ligne au milieu de la surface de jeu
        line.position.x = 0;

        // Ajout de la ligne à la scène
        scene.add(line);

        // Création des bordures extérieures du terrain
        const borderGeometry = new THREE.BoxGeometry(420, 188, 10);
        const borderMaterial = new THREE.MeshBasicMaterial({ color: 0x00bfff, transparent: true, opacity: 0.5 });
        const border = new THREE.Mesh(borderGeometry, borderMaterial);
        scene.add(border);


        // Gestion des événements clavier pour le joueur 1 (z pour monter, s pour descendre)
        document.addEventListener('keydown', function (event) {
            if (event.key === 'z') {
                playerPaddleSpeed = 3;
            } else if (event.key === 's') {
                playerPaddleSpeed = -3;
            }
        });

        document.addEventListener('keyup', function (event) {
            if (event.key === 'z' || event.key === 's') {
                playerPaddleSpeed = 0;
            }
        });

        // Gestion des événements clavier pour le joueur 2 (flèches haut et bas)
        document.addEventListener('keydown', function (event) {
            if (event.key === 'ArrowUp') {
                computerPaddleSpeed = 3;
            } else if (event.key === 'ArrowDown') {
                computerPaddleSpeed = -3;
            }
        });

        document.addEventListener('keyup', function (event) {
            if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                computerPaddleSpeed = 0;
            }
        });

        // Boucle de rendu du jeu
        const animate = function () {
            requestAnimationFrame(animate);

            // Mise à jour du jeu
            // Déplacement de la raquette du joueur 1
            playerPaddle.position.y += playerPaddleSpeed;

            // Limite de déplacement de la raquette du joueur 1
            if (playerPaddle.position.y >= 70) {
                playerPaddle.position.y = 70;
            } else if (playerPaddle.position.y <= -70) {
                playerPaddle.position.y = -70;
            }

            // Déplacement de la raquette du joueur 2 (ordinateur)
            computerPaddle.position.y += computerPaddleSpeed;

            // Limite de déplacement de la raquette du joueur 2 (ordinateur)
            if (computerPaddle.position.y >= 70) {
                computerPaddle.position.y = 70;
            } else if (computerPaddle.position.y <= -70) {
                computerPaddle.position.y = -70;
            }

            // Déplacement de la balle
            ball.position.x += ballSpeedX;
            ball.position.y += ballSpeedY;

            // Gestion des collisions avec les bordures extérieures
            if (ball.position.y >= 90 || ball.position.y <= -90) {
                ballSpeedY = -ballSpeedY;
                // Effet de rebond sur les bordures
                ballSpeedX += Math.sign(ballSpeedX) * 0.1; // Augmente la vitesse horizontale
            }
            if (ball.position.x >= 220 || ball.position.x <= -220) {
                // Balle derrière la raquette du joueur
                if (ball.position.x >= 220) {
                    computerScore++;
                }
                // Balle derrière la raquette de l'ordinateur
                else {
                    playerScore++;
                }
                // Réinitialisation de la position de la balle
                ball.position.set(0, 0, 0);
                // Réinitialisation de la vitesse de la balle
                ballSpeedX = 2;
                ballSpeedY = 2;
            }

            // Gestion des collisions avec les raquettes
            if (
                ball.position.x >= playerPaddle.position.x - paddleWidth / 2 &&
                ball.position.x <= playerPaddle.position.x + paddleWidth / 2 &&
                ball.position.y >= playerPaddle.position.y - paddleHeight / 2 &&
                ball.position.y <= playerPaddle.position.y + paddleHeight / 2
            ) {
                ballSpeedX = -ballSpeedX;
                ballSpeedX += Math.sign(ballSpeedX) * acceleration;
                ballSpeedY += Math.sign(ballSpeedY) * acceleration;
                // Effet de direction sur la balle selon la position de la raquette du joueur 1
                let deltaY = ball.position.y - playerPaddle.position.y;
                ballSpeedY += deltaY * 0.25;
            }

            if (
                ball.position.x >= computerPaddle.position.x - paddleWidth / 2 &&
                ball.position.x <= computerPaddle.position.x + paddleWidth / 2 &&
                ball.position.y >= computerPaddle.position.y - paddleHeight / 2 &&
                ball.position.y <= computerPaddle.position.y + paddleHeight / 2
            ) {
                ballSpeedX = -ballSpeedX;
                ballSpeedX += Math.sign(ballSpeedX) * acceleration;
                ballSpeedY += Math.sign(ballSpeedY) * acceleration;
                // Effet de direction sur la balle selon la position de la raquette du joueur 2
                let deltaY = ball.position.y - computerPaddle.position.y;
                ballSpeedY += deltaY * 0.25;
            }

            // Limite de la vitesse maximale horizontale
            if (Math.abs(ballSpeedX) > maxSpeedX) {
                ballSpeedX = Math.sign(ballSpeedX) * maxSpeedX;
            }

            // Limite de la vitesse maximale verticale
            if (Math.abs(ballSpeedY) > maxSpeedY) {
                ballSpeedY = Math.sign(ballSpeedY) * maxSpeedY;
            }

            // Rendu de la scène
            renderer.render(scene, camera);

            // Mise à jour de l'affichage des scores
            document.getElementById('playerScore').innerText = 'Player: ' + playerScore;
            document.getElementById('computerScore').innerText = 'Computer: ' + computerScore;

            // Vérification du gagnant
            if (playerScore >= 10) {
                alert('Player wins!');
                resetGame();
            } else if (computerScore >= 10) {
                alert('Computer wins!');
                resetGame();
            }
        };

        function resetGame() {
            playerScore = 0;
            computerScore = 0;
            ball.position.set(0, 0, 0);
            ballSpeedX = 2;
            ballSpeedY = 2;
        }

        animate();