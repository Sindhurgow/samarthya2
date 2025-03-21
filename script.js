// JavaScript for interactive Avengers animations

// Add event listeners to each Avenger image to trigger an animation effect on click.
document.querySelectorAll('.avenger').forEach(avenger => {
  avenger.addEventListener('click', function() {
    // Add a temporary class to animate
    this.classList.add('animate');
    // Remove the class after the animation completes (e.g., 600ms)
    setTimeout(() => {
      this.classList.remove('animate');
    }, 600);
  });
});

// Additional interactive effects can be added here.

// Get the card stack container
const cardStack = document.querySelector('.card-stack');

// Function to add drag event listeners on the top card in the deck
function addDragListener(card) {
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  // Function to handle drag start
  function dragStart(e) {
    isDragging = true;
    startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    card.style.transition = 'none';
    // Add listeners for move and end events
    document.addEventListener('mousemove', dragMove);
    document.addEventListener('touchmove', dragMove);
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchend', dragEnd);
  }

  // Function to handle drag move
  function dragMove(e) {
    if (!isDragging) return;
    currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const deltaX = currentX - startX;
    // Apply translation and slight rotation based on drag distance
    card.style.transform = `translateX(${deltaX}px) rotate(${deltaX / 15}deg)`;
  }

  // Function to handle drag end
  function dragEnd() {
    isDragging = false;
    const deltaX = currentX - startX;
    // Threshold for swipe-out (adjust as needed)
    const threshold = 100;
    if (Math.abs(deltaX) > threshold) {
      // Animate card out of view
      card.style.transition = 'transform 0.5s ease-out';
      card.style.transform = `translateX(${deltaX > 0 ? 1000 : -1000}px) rotate(${deltaX / 15}deg)`;
      card.addEventListener('transitionend', () => {
        card.remove();
        // Reset the deck by re-adding listener to new top card
        const remainingCards = cardStack.querySelectorAll('.card');
        if (remainingCards.length > 0) {
          addDragListener(remainingCards[remainingCards.length - 1]);
        }
      }, { once: true });
    } else {
      // Return card to original position
      card.style.transition = 'transform 0.5s ease';
      card.style.transform = '';
    }
    // Remove event listeners
    document.removeEventListener('mousemove', dragMove);
    document.removeEventListener('touchmove', dragMove);
    document.removeEventListener('mouseup', dragEnd);
    document.removeEventListener('touchend', dragEnd);
  }

  // Start dragging event
  card.addEventListener('mousedown', dragStart);
  card.addEventListener('touchstart', dragStart);
}

// Initialize by adding drag listener to the top card (the last element in the stack)
const initialCards = cardStack.querySelectorAll('.card');
if (initialCards.length > 0) {
  addDragListener(initialCards[initialCards.length - 1]);
}

// Save the initial state of the card deck for later restoration
const initialCardDeck = cardStack.innerHTML;

// Add click event listener to the reset button
document.getElementById('resetButton').addEventListener('click', () => {
  // Restore the card deck's original HTML
  cardStack.innerHTML = initialCardDeck;
  // Reattach the drag listener to the new top card
  const updatedCards = cardStack.querySelectorAll('.card');
  if (updatedCards.length > 0) {
    addDragListener(updatedCards[updatedCards.length - 1]);
  }
});


