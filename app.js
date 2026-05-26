const grid = document.getElementById("grid");

cars.forEach(car => {
  const div = document.createElement("div");
  div.className = "card";

  div.innerHTML = `
    <img src="${car.images[0]}">
    <h3>${car.title}</h3>
    <p>$${car.price}</p>
  `;

  div.onclick = () => {
    window.location.href = `car.html?id=${car.id}`;
  };

  grid.appendChild(div);
});
