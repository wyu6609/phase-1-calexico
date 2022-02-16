//global variable storage
let menuObjGlobal, totalCostGlobal;
//api endpoint
const uri = "http://localhost:3000/menu";
// menu item container node
const menuItemContainer = document.querySelector("#menu-items");
//dish detail container nodes
const dishImageDisplay = document.querySelector("#dish-image");
const dishNameDisplay = document.querySelector("#dish-name");
const dishDescriptionDisplay = document.querySelector("#dish-description");
const dishPriceDisplay = document.querySelector("#dish-price");
const dishQuantityDisplay = document.querySelector("#number-in-cart");
//submit form nodes
const cartForm = document.querySelector("#cart-form");
const cartAmountInput = document.querySelector("#cart-amount");
fetch(uri)
  .then((response) => response.json())
  .then((data) => {
    console.log("Success:");
    //render first object of JSON array
    renderDishDetails(data[0]);
    iterateThruJSONArr(data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

function iterateThruJSONArr(menuArr) {
  menuArr.forEach((menuObj) => renderMenuItems(menuObj));
}

function renderMenuItems(menuObj) {
  //create span El of Menu item
  let menuItemEl = document.createElement("span");
  //Add respective names of menu item to the span element
  menuItemEl.textContent = menuObj.name;
  menuItemContainer.appendChild(menuItemEl);
  menuItemEl.addEventListener("click", () => {
    console.log("clicked", menuObj.id);
    renderDishDetails(menuObj);
  });
}

//render menu images and display details of individual Menu obj
function renderDishDetails(menuObj) {
  dishImageDisplay.src = menuObj.image;
  dishNameDisplay.textContent = menuObj.name;
  dishDescriptionDisplay.textContent = menuObj.description;
  dishPriceDisplay.textContent = `$ ${menuObj.price}`;
  dishQuantityDisplay.textContent = menuObj.number_in_bag;

  //passes the displayed dish Obj to the global scope for future manipulation
  menuObjGlobal = menuObj;
}

//Add to cart event listener
cartForm.addEventListener("submit", (event) => {
  event.preventDefault();
  //   console.log(menuObjGlobal);
  //cart total -> currentObj value + textBox's value
  menuObjGlobal.number_in_bag += parseInt(cartAmountInput.value);
  //display on UI
  dishQuantityDisplay.textContent = menuObjGlobal.number_in_bag;
  //update JSON
  patchRequest(menuObjGlobal);
  createTotalCost(menuObjGlobal);
});

//patch request -update json
function patchRequest(menuObj) {
  fetch(`${uri}/${menuObj.id}`, {
    method: "PATCH", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(menuObj),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(
        `${data.name}'s number_in_bag updated to ${data.number_in_bag} in db.JSON!`
      );
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function createTotalCost(menuObj) {
  let totalCost = parseInt(menuObj.number_in_bag * menuObj.price);
  document.querySelector("#total-cost").textContent = `TOTAL: $${totalCost}`;
}
