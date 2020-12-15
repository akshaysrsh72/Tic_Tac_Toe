
	var origBoard;
	var mode;
	var turns;
	var huPlayer ;
	var aiPlayer ;
	var huPlayer2 ;
	var aiPlayer2 ;
	const winCombos = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[6, 4, 2]

	]
	$(document).ready(function() {
		$('#player_turn').hide();
		$('.bord').hide();
		$('#choose_icon').hide();
		$('#choose_icon2').hide();
		$('#reset').hide();
		$('#player1_name').hide();
		$('#player2_name').hide();
		$('#label').hide();

		const cells = document.querySelectorAll('.cell');


		// to select game
		$('#1player').on('click', function() {
			$('#choose_icon').show();
			$('#2player').hide();
			$('#reset').show();
			$('#player1_name').show();
			mode='1player'
			

			$('#icon_x').on('click', function(){
				//$('.bord').show()
				$('#icon_x').css('background-color', 'green');
				$('#icon_o').hide()
				if (document.getElementById("player1_name").value==""){
					document.getElementById("player1_name").value="You"
					$('.bord').show(2000)
				}
				else{
					
					$('.bord').show(2000)
				}
				huPlayer='X';
				aiPlayer='O';
				$('#restart').show();
				startGame();
				$('#restart_btn').on('click', function() {
					startGame();
				});

			});
			

			$('#icon_o').on('click', function() {
				$('.bord').show()
				$('#icon_o').css('background-color', 'green');
				$('#icon_x').hide()
				if (document.getElementById("player1_name").value=="") {
					document.getElementById("player1_name").value="You"
					$('.bord').show(2000)
				}
				else{
					$('.bord').show(2000)
				}
				huPlayer='O';
				aiPlayer='X';
				startGame();
				$('#restart_btn').on('click', function() {
					startGame();
				});	

			});
			
			function startGame() {
				document.querySelector(".endgame").style.display = "none";
				origBoard = Array.from(Array(9).keys());
				for (var i = 0; i < cells.length; i++) {
					cells[i].innerText = '';
					cells[i].style.removeProperty('background-color');
					cells[i].addEventListener('click', turnClick, false);
					
				}
			}

			function turnClick(square) {
				if (typeof origBoard[square.target.id] == 'number') {
					turn(square.target.id, huPlayer)
					if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
				}
			}

			function turn(squareId, player) {
				origBoard[squareId] = player;
				document.getElementById(squareId).innerText = player;
				let gameWon = checkWin(origBoard, player)
				if (gameWon) gameOver(gameWon)
			}

			function checkWin(board, player) {
				let plays = board.reduce((a, e, i) => 
				(e === player) ? a.concat(i) : a, []);
				let gameWon = null;
				for (let [index, win] of winCombos.entries()) {
					if (win.every(elem => plays.indexOf(elem) > -1)) {
						gameWon = {index: index, player: player};
						break;
					}
				}
				return gameWon;
			}

			function gameOver(gameWon) {
				for (let index of winCombos[gameWon.index]) {
					document.getElementById(index).style.backgroundColor =
					gameWon.player == huPlayer ? "blue" : "red";
				}
				for (var i = 0; i < cells.length; i++) {
					cells[i].removeEventListener('click', turnClick, false);
				}
				name1=document.getElementById("player1_name").value;
				declareWinner(gameWon.player == huPlayer ? name1 : "computer");
			}

			function declareWinner(who) {
				document.querySelector(".endgame").style.display = "block";
				document.querySelector(".endgame .text").innerText = who+"  win !";
			}

			function emptySquares() {
				return origBoard.filter(s => typeof s == 'number');
			}

			function bestSpot() {
				return minimax(origBoard, aiPlayer).index;
				//return emptySquares()[0];
			}

			function checkTie() {
				if (emptySquares().length == 0) {
					for (var i = 0; i < cells.length; i++) {
						cells[i].style.backgroundColor = "green";
						cells[i].removeEventListener('click', turnClick, false);
					}
					declareWinner("Tie Game!")
					return true;
				}
				return false;
			}

			function minimax(newBoard, player) {
				var availSpots = emptySquares();

				if (checkWin(newBoard, huPlayer)) {
					return {score: -10};
				} 	
				else if (checkWin(newBoard, aiPlayer)) {
					return {score: 10};
				} 	
				else if (availSpots.length === 0) {
						return {score: 0};
				}
				var moves = [];
				for (var i = 0; i < availSpots.length; i++) {
					var move = {};
					move.index = newBoard[availSpots[i]];
					newBoard[availSpots[i]] = player;

					if (player == aiPlayer) {
						var result = minimax(newBoard, huPlayer);
						move.score = result.score;
					} else {
						var result = minimax(newBoard, aiPlayer);
						move.score = result.score;
					}

					newBoard[availSpots[i]] = move.index;

					moves.push(move);
				}

				var bestMove;
				if(player === aiPlayer) {
					var bestScore = -10000;
					for(var i = 0; i < moves.length; i++) {
						if (moves[i].score > bestScore) {
							bestScore = moves[i].score;
							bestMove = i;
						}
					}
				} 
				else {
					var bestScore = 10000;
					for(var i = 0; i < moves.length; i++) {
						if (moves[i].score < bestScore) {
							bestScore = moves[i].score;
							bestMove = i;
						}
					}
				}

				return moves[bestMove];
			}
			$('#reset').on('click', function() {
				document.getElementById("player1_name").value=''
				location.reload();
			

			});

	    });
		
		$('#2player').on('click', function() {
			$('#player_turn').show();
			$('#1player').hide();
			$('#reset').show();
			//$('.bord').show()
			$('#player1_name').show();
			$('#player2_name').show();
			$('#label').show();
			$('#choose_icon2').show();
			$('#icon_x2').on('click', function(){
				
				$('#icon_x2').css('background-color','blue');
				$('#icon_o2').css('background-color','red');
				if ((document.getElementById("player1_name").value=="") || (document.getElementById("player2_name").value=="")){
					
					document.getElementById("player1_name").value="player 1"
					document.getElementById("player2_name").value="player 2"
					$('.bord').show(2000);
				}
				else{
					
				
					$('.bord').show(2000);
				}

				
				huPlayer2='X';
				aiPlayer2='O';
				var turns=1;
				$('#player_turn').text(aiPlayer2+' turn');
				
				startGame2();
				$('#restart_btn2').on('click', function() {
					startGame2();
				});

			});

			$('#icon_o2').on('click', function(){
				
				$('#icon_o2').css('background-color', 'blue');
				$('#icon_x2').css('background-color', 'red');
				if ((document.getElementById("player1_name").value=="") || (document.getElementById("player2_name").value=="")){
					
					document.getElementById("player1_name").value="player 1"
					document.getElementById("player2_name").value="player 2"
					$('.bord').show(2000);
				}
				else{
					
					$('.bord').show(2000);
				}
		
				huPlayer2='O';
				aiPlayer2='X';
				var turns=2;
				$('#player_turn').text(aiPlayer2+' turn');
				
				startGame2();
				$('#restart_btn2').on('click', function() {
					startGame2();
				});

			});



			function startGame2() {
				document.querySelector(".endgame2").style.display = "none";
				origBoard = Array.from(Array(9).keys());
				for (var i = 0; i < cells.length; i++) {
					cells[i].innerText = '';
					cells[i].style.removeProperty('background-color');
					cells[i].addEventListener('click', turnClick2, false);
					
				}
			}

			function turnClick2(square) {
				if (!checkWin2(origBoard, aiPlayer2) && !checkTie2()){
					if (turns==1){
						
						
						if (typeof origBoard[square.target.id] == 'number') {
							turn2(square.target.id, huPlayer2,aiPlayer2);
							turns=2;
							
						}

					}
					else{
						
						
						if (typeof origBoard[square.target.id] == 'number') {
							turn2(square.target.id, aiPlayer2,huPlayer2);
							turns=1;
							
						}
						
					}
					
				}
			}

			function turn2(squareId, player,nextPlayer) {
				origBoard[squareId] = player;
				document.getElementById(squareId).innerText = player;
				$('#player_turn').text(nextPlayer+' turn');
				let gameWon = checkWin2(origBoard, player)
				if (gameWon) gameOver2(gameWon)
			}

			function checkWin2(board, player) {
				let plays = board.reduce((a, e, i) => 
				(e === player) ? a.concat(i) : a, []);
				let gameWon = null;
				for (let [index, win] of winCombos.entries()) {
					if (win.every(elem => plays.indexOf(elem) > -1)) {
						gameWon = {index: index, player: player};
						break;
					}
				}
				return gameWon;
			}

			function gameOver2(gameWon) {
				for (let index of winCombos[gameWon.index]) {
					document.getElementById(index).style.backgroundColor =
					gameWon.player == huPlayer2 ? "red" : "blue";
				}
				for (var i = 0; i < cells.length; i++) {
					cells[i].removeEventListener('click', turnClick2, false);
				}
				name1=document.getElementById("player1_name").value;
				name2=document.getElementById("player2_name").value;
				declareWinner2(gameWon.player == huPlayer2 ? name2 : name1);
			}

			function declareWinner2(who) {
				document.querySelector(".endgame2").style.display = "block";
				document.querySelector(".endgame2 .text2").innerText = who+" win!..";
			}
			function declaretie(tie) {
				document.querySelector(".endgame2").style.display = "block";
				document.querySelector(".endgame2 .text2").innerText = tie;
			}

			function emptySquares2() {
				return origBoard.filter(s => typeof s == 'number');
			}

			function checkTie2() {
				if (emptySquares2().length == 0) {
					for (var i = 0; i < cells.length; i++) {
						cells[i].style.backgroundColor = "green";
						cells[i].removeEventListener('click', turnClick2, false);
					}
					declaretie("Tie Game!")
					
					return true;
				}
				return false;
			}
			

			

			

			
		$('#reset').on('click', function() {
			document.getElementById("player1_name").value=''
			document.getElementById("player2_name").value=''
				location.reload();
		});		
		});
	});
