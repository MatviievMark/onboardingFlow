let currentImage = 0;
let totalImages = 75;
const flipbook = document.getElementById("flipbook");
const textElement = document.getElementById("text");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
let stepsContainer = document.querySelector(".steps-container");

let currentJSONFile = "";

function loadJSON(jsonFile) {
  currentImage = 0;
  currentJSONFile = jsonFile;

  fetch(jsonFile)
    .then((response) => response.json())
    .then((data) => {
      imageTexts = data;
      totalImages = imageTexts.length;
      console.log(imageTexts.length);
      changeImage();
    });
}

document.getElementById("watchLink").addEventListener("click", function () {
  loadJSON("watchText.json");
});

document.getElementById("iphoneLink").addEventListener("click", function () {
  loadJSON("iphoneText.json");
});

function changeImage() {
  let imageFolder =
    currentJSONFile === "watchText.json" ? "docum/" : "documiPhone/";
  flipbook.querySelector("img").src = imageFolder + (currentImage + 1) + ".png";
  textElement.textContent = imageTexts[currentImage].title;

  let oldHeight = stepsContainer.offsetHeight;

  // Clear previous list elements
  stepsContainer.innerHTML = "";

  // Add new list elements for each subtext
  imageTexts[currentImage].subtexts.forEach((subtext, index) => {
    let li = document.createElement("ol");
    li.textContent = index + 1 + ". " + subtext;
    stepsContainer.appendChild(li);
  });

  setTimeout(function () {
    let listItems = stepsContainer.getElementsByTagName("li");
    for (let item of listItems) {
      item.style.opacity = "1";
    }
  }, 100);

  let newHeight = stepsContainer.offsetHeight;

  // Animate from the old height to the new height
  stepsContainer.style.height = oldHeight + "px";
  stepsContainer.offsetHeight; // Force a reflow
  stepsContainer.style.height = newHeight + "px";
  console.log(stepsContainer.offsetHeight);
}

stepsContainer.addEventListener("transitionend", function () {
  this.style.height = "auto";
});

function buttonTransition() {
  if (currentImage >= totalImages - 1) {
    nextButton.style.transform = "translateX(-120px)";
    nextButton.style.opacity = "0";
    nextButton.style.pointerEvents = "none";
    prevButton.style.right = "0";
  } else {
    nextButton.style.transform = "translateX(0)";
    nextButton.style.opacity = "1";
    nextButton.style.pointerEvents = "auto";
    prevButton.style.right = "120px";
  }

  if (currentImage < 0) {
    currentImage = totalImages - 1;
  }
}

function nextImage() {
  currentImage++;
  if (currentImage >= totalImages) {
    currentImage = 0;
  }
  changeImage();
  nextButton.style.left = "120px";
  prevButton.style.opacity = 1;
  buttonTransition(); // Add this
}

function prevImage() {
  currentImage--;
  if (currentImage < 0) {
    currentImage = totalImages - 1;
  }
  changeImage();
  buttonTransition(); // Add this
}

window.addEventListener("load", function () {
  nextButton.addEventListener("click", nextImage);
  nextButton.style.opacity = 1;
  prevButton.addEventListener("click", prevImage);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    nextImage();
  } else if (event.key === "ArrowLeft") {
    prevImage();
  }
});

prevButton.addEventListener("click", prevImage);
nextButton.addEventListener("click", nextImage);

document
  .getElementById("dropdownButton")
  .addEventListener("click", function () {
    this.classList.toggle("rotate");
    var dropdownContent = document.getElementById("dropdownContent");
    if (this.style.transform === "rotate(90deg)") {
      this.style.transform = "";
      dropdownContent.style.pointerEvents = "none"; // Add this
      dropdownContent.style.width = "0";
      dropdownContent.style.transform = "translateX(100%)";
      Array.from(dropdownContent.children).forEach(function (child) {
        child.style.opacity = "0";
      });
      setTimeout(function () {
        dropdownContent.style.display = "none";
        dropdownContent.style.pointerEvents = "auto";
      }, 500);
    } else {
      this.style.transform = "rotate(90deg)";
      dropdownContent.style.display = "flex";
      dropdownContent.style.pointerEvents = "none";
      setTimeout(function () {
        dropdownContent.style.width = "auto";
        dropdownContent.style.transform = "translateX(0)";
        Array.from(dropdownContent.children).forEach(function (child) {
          child.style.opacity = "1";
        });
        setTimeout(function () {
          dropdownContent.style.pointerEvents = "auto";
        }, 500);
      }, 0);
    }
  });

// Selet the iPhone by default
document.getElementById("iphoneLink").click();

let points = document.querySelectorAll(".point-container");
let bars = document.querySelectorAll(".bar .inner-bar"); // select the inner bars
let previousPoint = null;
let previousIndex = 0;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

points.forEach((point, index) => {
  point.addEventListener("click", async function () {
    // Remove the highlighted class from all points
    points.forEach((p) => {
      p.querySelector(".point").className = p
        .querySelector(".point")
        .className.replace(" highlighted", "");
      p.querySelector(".point-text").className = p
        .querySelector(".point-text")
        .className.replace(" first", "")
        .replace(" last", "");
    });

    if (previousPoint) {
      previousPoint.querySelector(".point").className += " completed";
    }

    let currentText = document.querySelector(".visible");
    if (currentText) {
      currentText.className = currentText.className.replace(" visible", "");
    }

    this.querySelector(".point").className += " highlighted";
    let pointText = this.querySelector(".point-text");
    if (pointText) {
      pointText.className += " visible";

      // If it's the first point
      if (index === 0) {
        pointText.className += " first";
      }
      // If it's the last point
      else if (index === points.length - 1) {
        pointText.className += " last";
      }
    }

    if (index > previousIndex) {
      for (let i = previousIndex; i < index; i++) {
        if (bars[i]) {
          bars[i].style.width = "100%";
          await delay(500);
        }
      }
    }

    previousPoint = this;
    previousIndex = index;
  });
});

window.addEventListener("load", function () {
  let firstPoint = document.querySelector(".point-container:first-child");
  if (firstPoint) {
    firstPoint.querySelector(".point").className += " highlighted";
    previousPoint = firstPoint;
    previousIndex = 0; // set the initial index
  }

  if (firstPoint) {
    firstPoint.click();
  }
});
