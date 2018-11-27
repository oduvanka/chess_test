var
	game = new Chess(),
	
	figures = document.querySelectorAll('.contentFigure'),
	dragged,
	
	captivesW = document.querySelector('#captivesW'),
	captivesB = document.querySelector('#captivesB'),
	
	statusEl,
	fenEl;


var removeGreySquares = function() {
	//удалим подсветку с клеток
	
	var squaresLegalW = document.querySelectorAll('.whiteCageLegal');
	var squaresLegalB = document.querySelectorAll('.blackCageLegal');
	
	for (var i=0; i<=squaresLegalW.length-1; i++) {
		squaresLegalW[i].classList.remove('whiteCageLegal');
	}
	for (var j=0; j<=squaresLegalB.length-1; j++) {
		squaresLegalB[j].classList.remove('blackCageLegal');
	}
};

var greySquare = function(square) {
	//подсветим клетку, на которую можно походить
	var squareLegal = document.getElementById('cage-' + square);
	var background = 'whiteCageLegal';
	if (squareLegal.classList.contains('blackCage')) {
		background = 'blackCageLegal';
	}
	squareLegal.classList.add(background);
};

var addCageMouseOver = function (figure) {
	//при наведении на фигуру проверим вызовем подсветку доступных дл€ перемещени€ клеткок
	figure.addEventListener("mouseover", function() {
	
		var square = event.target.parentNode.dataset.square;
		
		// get list of possible moves for this cage
		var moves = game.moves({
			square: square,
			verbose: true
		});
		
		// exit if there are no moves available for this square
		if (moves.length === 0) return;
		
		// highlight the square they moused over
		greySquare(square);
		
		// highlight the possible squares for this piece
		for (var i = 0; i < moves.length; i++) {
			greySquare(moves[i].to);
		}
  });
};

var addCageMouseOut = function (figure) {
	//при сходе курсора с клетки, на которой фигура, вызовем удаление подсветки клеток
	figure.addEventListener("mouseout", function() {
		removeGreySquares();
	});
};



var addFigureDragStart = function (figure) {
	figure.addEventListener("dragstart", function() {	
		var piece = event.target.dataset.piece;
		
		// do not pick up pieces if the game is over
		// or if it's not that side's turn
		if (game.game_over() === true ||
			(game.turn() === 'w' && piece.search(/^b/) !== -1) ||
			(game.turn() === 'b' && piece.search(/^w/) !== -1)) {
			return false;
		}
		else {
			dragged = event.target;
			event.target.style.opacity = 0.1;
		}
	});
};


document.addEventListener("dragend", function(evt) {
	// reset the transparency
	evt.target.style.opacity = "";
}, false);

/* events fired on the drop targets */
document.addEventListener("dragover", function(evt) {
	// prevent default to allow drop
	evt.preventDefault();
}, false);


document.addEventListener("drop", function(evt) {
	// prevent default action (open as link for some elements)
	evt.preventDefault();
	
	//evt.target.style.opacity = "";
	removeGreySquares();
	
	var toCage = evt.target;
	if ( ~evt.target.className.indexOf("contentFigure")) {
		toCage = evt.target.parentNode;
	}	
	// see if the move is legal
	var move = game.move({
		from: dragged.parentNode.dataset.square,
		to: toCage.dataset.square,
		promotion: 'q' // NOTE: always promote to a queen for example simplicity
	});

	// illegal move
	if (move === null) {
	}
	else {
		// move dragged elem to the selected drop target	
		if ( ~evt.target.className.indexOf("contentFigure")) {
			//если в клетке, в которую будем перетаскивать, есть фигура, уберЄм еЄ пленником в соответствующий сброс
			toCage.removeChild(evt.target);
			if (move.color === 'w') {
				captivesB.appendChild(evt.target);
			}
			else {
				captivesW.appendChild(evt.target);
			}
			evt.target.classList.add('captiveFigure');
		}
		dragged.parentNode.removeChild(dragged);
		toCage.appendChild(dragged);
		updateStatus();
	}
}, false);

var updateStatus = function() { //ќбновление статуса
	var status = '';
	var moveColor = 'белые';
	if (game.turn() === game.BLACK) {
		moveColor = 'чЄрные';
	}
	if (game.in_checkmate() === true) { //ћат
		status = '¬не игры, ' + moveColor + ' получили мат';
		/*-----------------------------------------------------------------------*/
		/*добавить удаление cookie - записать задним числом*/
		/*-----------------------------------------------------------------------*/
	}
	else if (game.in_draw() === true) { //Ќичь€
		status = '¬не игры, ничь€';
		/*-----------------------------------------------------------------------*/
		/*добавить удаление cookie - записать задним числом*/
		/*-----------------------------------------------------------------------*/
	}
	else {
		status = moveColor + ' могут ходить';
		if (game.in_check() === true) { //Ўах
			status += ', ' + moveColor + ' под шахом';
		}
	}
	statusEl = status;
	fenEl = game.fen();
	setCookie(fenEl);
};


for (var i = 0; i < figures.length; i++) {
	addCageMouseOver(figures[i]);
	addCageMouseOut(figures[i]);
	addFigureDragStart(figures[i]);
}