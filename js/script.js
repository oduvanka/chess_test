var cages = document.querySelectorAll('.cage');
var dragged;
var game = new Chess();

/* events fired on the draggable target */
document.addEventListener("drag", function(evt) {
}, false);

document.addEventListener("dragstart", function(evt) {
	// store a ref. on the dragged elem
	dragged = evt.target;
	// make it half transparent
	evt.target.style.opacity = 0.5;
}, false);

document.addEventListener("dragend", function(evt) {
	// reset the transparency
	evt.target.style.opacity = "";
}, false);

/* events fired on the drop targets */
document.addEventListener("dragover", function(evt) {
	// prevent default to allow drop
	evt.preventDefault();
}, false);

document.addEventListener("dragenter", function(evt) {
	// highlight potential drop target when the draggable element enters it
	if (~evt.target.id.indexOf("cage-")) {
		evt.target.style.background = "purple";
	}
}, false);

document.addEventListener("dragleave", function(evt) {
	// reset background of potential drop target when the draggable element leaves it
	if ( ~evt.target.id.indexOf("cage-") ) {
		evt.target.style.background = "";
	}
}, false);

document.addEventListener("drop", function(evt) {
	// prevent default action (open as link for some elements)
	evt.preventDefault();
	// move dragged elem to the selected drop target
	if ( ~evt.target.id.indexOf("cage-") ) {
		evt.target.style.background = "";
		dragged.parentNode.removeChild(dragged);
		evt.target.appendChild(dragged);
	}
}, false);


var removeGreySquares = function() {
  /*$('.cage').css('background', '');*/
};

var greySquare = function(square) {
	var background = "rgba(0, 0,0, 0.5)";
	var squareEl = document.getElementById('cage-' + square);
	squareEl.style.background = background;
};




var addCageMouseOver = function (cage) {
  cage.addEventListener("mouseover", function() {
	// get list of possible moves for this cage
	var moves = game.moves({
		square: cage.dataset.square,
		verbose: true
	});
	
	// exit if there are no moves available for this square
	if (moves.length === 0) return;
	
	// highlight the square they moused over
	greySquare(cage.dataset.square);
	
	// highlight the possible squares for this piece
	for (var i = 0; i < moves.length; i++) {
		greySquare(moves[i].to);
	}
  });
};

var addCageMouseOut = function (cage) {
  cage.addEventListener("mouseout", function() {
	removeGreySquares();
  });
};

for (var i = 0; i < cages.length; i++) {
	addCageMouseOver(cages[i]);
	addCageMouseOut(cages[i]);
}