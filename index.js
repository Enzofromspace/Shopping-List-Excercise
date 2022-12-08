// Import stylesheets
import './style.css';
import './shopping.css';

// Write Javascript code!
const appDiv = document.getElementById('app');
appDiv.innerHTML = `<h1>Shopping List Excercise</h1>`;

const shoppingForm = document.querySelector('.shopping');
const list = document.querySelector('.list');

// create an array to hold state
let items = [];

function handleSubmit(e) {
  e.preventDefault();
  const name = e.currentTarget.item.value;
  //stop empty submissions in text field
  if(!name) return; 
  //create an item to see if checked and attach unique ID
  const item = {
    name = name,
    id: Date.now(),
    complete: false,
  };
  // push the item to stae
  items.push(item);
  console.log(`added ${items.length}`)
  //clear it
  e.currentTarget.reset();
  //fire a custome event for robots to notice items update
  list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function displayItems(){
 // console.log(items);
  const html = items
  .map(item => `<li class="shopping-item">
  <input 
    value="${item.id}" 
    type="checkbox"
    ${item.complete ? 'checked' : ''}
  >
  <span class="itemName">${item.name}</span>
  <button 
    aria-label="Remove ${item.name}" 
    value="${item.id}"
    >&times;</button></li>`
    ).join('');
  list.innerHTML = html;
} 

function mirrorToLocalStorage(){
  localStorage.setItem('items', JSON.stringify(items));
}

function restoreFromLocalStorage(){
  const lsItems = JSON.parse(localStorage.getItem('items'));
  if(lsItems.length) {
    items.push(...lsItems);
    list.dispatchEvent(new CustomEvent('itemsUpdate'));
  }
}

function deleteItem(id){
  items = items.filter(item => item.id !== id); 
  list.dispatchEvent(new CustomEvent('itemsUpdate'));
}

function markAsComplete(id){
  const itemRef = items.find(item => item.id === id);
  itemRef.complete = !itemRef.complete;
  list.dispatchEvent(new CustomEvent('itemsUpdate'));
}

shoppingForm.addEventListener('submit', handleSubmit);
list.addEventListener('itemsUpdated', displayItems);
list.addEventListener('itemsUpdated', mirrorToLocalStorage);
// looks for click on list and delegates to button if clicked
list.addEventListener('click', function(e){
  const id = parseInt(e.target.value);
  if(e.target.matches('button')) {
    deleteItem(id);
  }
  if(e.target.matches('input[type="checkbox"]')){
    markAsComplete(id);
  }
});

restoreFromLocalStorage();

