const cars = [
  {
    title: "Mercedes-AMG GT 63 S",
    img: "https://upload.wikimedia.org/wikipedia/commons/3/3b/2019_Mercedes-AMG_GT_4-Door_Coupe_63_S_4MATIC%2B_4.0.jpg",
    desc: "V8 Biturbo 630 к.с. — спорт та розкіш"
  },
  {
    title: "Mercedes S-Class",
    img: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Mercedes-Benz_W223_IMG_4011.jpg",
    desc: "Флагман комфорту та технологій"
  },
  {
    title: "Mercedes G-Class",
    img: "https://upload.wikimedia.org/wikipedia/commons/3/3f/2018_Mercedes-Benz_G_500_AMG_Line_4MATIC_4.0_Front.jpg",
    desc: "Легендарний позашляховик"
  },
  {
    title: "Mercedes EQS",
    img: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Mercedes-Benz_V297_1X7A6436.jpg",
    desc: "Електричний флагман Mercedes"
  },
  {
    title: "Mercedes GLE Coupe",
    img: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Mercedes-Benz_C167_IMG_4247.jpg",
    desc: "Спортивний SUV купе"
  },
  {
    title: "Mercedes C-Class",
    img: "https://upload.wikimedia.org/wikipedia/commons/1/15/Mercedes-Benz_W206_IMG_5267.jpg",
    desc: "Бізнес седан нового покоління"
  },
  {
    title: "Mercedes E-Class",
    img: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Mercedes-Benz_W214_IMG_0075.jpg",
    desc: "Баланс комфорту та потужності"
  },
  {
    title: "Mercedes Maybach S-Class",
    img: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Mercedes-Maybach_S_580_4MATIC_IMG_5120.jpg",
    desc: "Максимальна розкіш"
  }
];

const grid = document.getElementById("carsGrid");
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const closeBtn = document.getElementById("closeBtn");

cars.forEach(car => {
  const div = document.createElement("div");
  div.className = "card";

  div.innerHTML = `
    <img src="${car.img}">
    <h3>${car.title}</h3>
  `;

  div.onclick = () => {
    modal.style.display = "flex";
    modalImg.src = car.img;
    modalTitle.textContent = car.title;
    modalDesc.textContent = car.desc;
  };

  grid.appendChild(div);
});

closeBtn.onclick = () => {
  modal.style.display = "none";
};
