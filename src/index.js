let addToy = false;

document.addEventListener("DOMContentLoaded", () => {

  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");

  function renderOneToy(toy) {

    // Get the parent node whose child is a toy card
    const toyCollection = document.querySelector('div#toy-collection')

    // Make a toy card
    const card = document.createElement('div')
    card.classList.add("card")
    toyCollection.appendChild(card)

    // Name the toy
    const h2 = document.createElement('h2')
    h2.innerHTML = toy.name
    card.appendChild(h2)

    // Put the image of the toy
    const image = document.createElement('img')
    image.src = toy.image
    image.className = "toy-avatar"
    card.appendChild(image)

    // Put the likes
    const p = document.createElement('p')
    p.innerHTML = `${toy.likes} likes`
    card.appendChild(p)

    // Put the button to update the likes, along with the id
    const btn = document.createElement('button')
    btn.classList.add("like-btn")
    btn.id = toy.id
    btn.innerHTML = "Like ❤️"
    card.appendChild(btn)

    // If the user clicks the like button, update the likes
    card.querySelector('.like-btn').addEventListener('click', () => {
      toy.likes += 1
      updateToy(toy)
    })

  }

  function updateToy(toyObj){
    fetch(`http://localhost:3000/toys/${toyObj.id}`, {
      method: 'PATCH',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(toyObj)
    })
    .then(response => response.json())
    .then(toy => {

      // Get all the toy cards
      const toyCards = document.querySelectorAll("div.card")

      // Update the likes for the toy with the id
      const theLikes = toyCards[`${toy.id - 1}`].querySelector("p")
      theLikes.innerHTML = `${toy.likes} likes`
    })
  }

  // Get data and render them to the DOM
  function getAllToys() {
    fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toys => toys.forEach(toy => renderOneToy(toy)))
    .catch(function (error) {
      alert("401!");
      const toyCollection = document.querySelector('div#toy-collection')
      const h2 = document.createElement('h2');
      h2.innerHTML = "Unauthorized Access";
      toyCollection.appendChild(h2);
    });
  }
  getAllToys()


function submitData(nameInput, imageInput) {

    const formData = {
        "name": nameInput,
        "image": imageInput,
        "likes": 0
      };
      
    const configurationObject = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(formData),
      };
    
    fetch('http://localhost:3000/toys', configurationObject)
      .then((response) => response.json())
      .then((data) => renderOneToy(data))
      .catch(function (error) {
        alert("401!!!");
        const errorMsg = document.querySelector('.container')
        const h2 = document.createElement('h2');
        h2.innerHTML = "Unauthorized Access";
        errorMsg.appendChild(h2);
      });
}

  toyFormContainer.addEventListener('submit', function(event) {
    
    let nameInput = document.querySelectorAll("input.input-text")[0];
    let imageInput = document.querySelectorAll("input.input-text")[1];
            
    submitData(nameInput.value, imageInput.value);

  });

  addBtn.addEventListener("click", () => {

    // hide & seek with the form
    addToy = !addToy;

    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

});
