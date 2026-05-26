const cars = [
  {
    title: "AMG GT 63",
    type: "sport",
    desc: "630 HP V8 Biturbo",
    specs: ["0-100: 3.2s", "630 HP", "AMG Performance"],
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/3/3b/2019_Mercedes-AMG_GT_4-Door.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/5c/Mercedes_AMG_GT_front.jpg"
    ]
  },
  {
    title: "S-Class",
    type: "sedan",
    desc: "Luxury flagship sedan",
    specs: ["Comfort+", "Autopilot", "Massage seats"],
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/3/3e/Mercedes-Benz_W223.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/7a/Mercedes_S_class_interior.jpg"
    ]
  },
  {
    title: "G-Class",
    type: "suv",
    desc: "Legendary off-road SUV",
    specs: ["4x4", "Luxury", "Iconic design"],
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/3/3f/Mercedes_G_class.jpg"
    ]
  },
  {
    title: "EQS",
    type: "electric",
    desc: "Electric flagship",
    specs: ["770km range", "EV", "Hyperscreen"],
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/3/3d/Mercedes_EQS.jpg"
    ]
  }
];

const grid = document.getElementById("grid");

const modal = document.getElementById("modal");
const mainImg = document.getElementById("mainImg");
const thumbs = document.getElementById("thumbs");
const title = document.getElementById("title");
const desc = document.getElementById("desc");
const specs = document.getElementById("specs");

function render(list) {
  grid.innerHTML = "";

  list.forEach(car => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <img src="${car.images[0]}">
      <div class="card-body">
        <h3>${car.title}</h3>
        <p>${car.type}</p>
      </div>
    `;

    div.onclick = () => open(car);

    grid.appendChild(div);
  });
}

function open(car) {
  modal.style.display = "flex";

  mainImg.src = car.images[0];
  title.textContent = car.title;
  desc.textContent = car.desc;

  specs.innerHTML = car.specs.map(s => `<li>${s}</li>`).join("");

  thumbs.innerHTML = "";
  car.images.forEach(img => {
    const t = document.createElement("img");
    t.src = img;
    t.onclick = () => mainImg.src = img;
    thumbs.appendChild(t);
  });
}

document.getElementById("close").onclick = () => modal.style.display = "none";

window.onclick = e => {
  if (e.target === modal) modal.style.display = "none";
};

document.getElementById("search").oninput = e => {
  render(cars.filter(c => c.title.toLowerCase().includes(e.target.value.toLowerCase())));
};

document.getElementById("filter").onchange = e => {
  if (!e.target.value) return render(cars);
  render(cars.filter(c => c.type === e.target.value));
};

render(cars);
