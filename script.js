const cars = [
  { name: "AMG GT", price: "$185,000" },
  { name: "S-Class", price: "$142,000" },
  { name: "G-Class", price: "$220,000" },
  { name: "EQS 580", price: "$138,000" }
];

const grid = document.getElementById("carsGrid");

cars.forEach(car => {
  const div = document.createElement("div");
  div.className = "car";

  div.innerHTML = `
    <h3>${car.name}</h3>
    <p>${car.price}</p>
  `;

  grid.appendChild(div);
});
