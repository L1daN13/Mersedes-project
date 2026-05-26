const cars = [
  { name: "AMG GT", price: "$185,000" },
  { name: "S-Class", price: "$142,000" },
  { name: "G-Class", price: "$220,000" }
];

const grid = document.getElementById("carsGrid");

cars.forEach(car => {
  const div = document.createElement("div");
  div.style.padding = "15px";
  div.style.background = "#1a1a1a";
  div.style.borderRadius = "10px";

  div.innerHTML = `
    <h3>${car.name}</h3>
    <p>${car.price}</p>
  `;

  grid.appendChild(div);
});
