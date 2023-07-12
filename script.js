let currentImage = 0;
let totalImages = 75;
const textElement = document.getElementById("text");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
let stepsContainer = document.querySelector(".steps-container");
let isTransitionRunning = false;

let currentJSONFile = "";
let lastImageReached = false;
let images = document.querySelectorAll(
  '.img-container img:not([class^="zoom-icon"])'
);
let zoomIcons = document.querySelectorAll(
  '.img-container img[class^="zoom-icon"]'
);
let overlay = document.querySelector(".overlay");

for (let i = 0; i < zoomIcons.length; i++) {
  zoomIcons[i].addEventListener("click", function () {
    if (images[i].style.transform === "") {
      images[i].style.transform = "scale(1.5)";
      images[i].classList.add("zoomed-in");
      overlay.style.display = "block";
      images[i].style.transform += " translate(50%, -5%)";
    } else {
      images[i].style.transform = "";
      images[i].classList.remove("zoomed-in");
      overlay.style.display = "none";
    }
  });
}

overlay.addEventListener("click", function () {
  images.forEach(function (img) {
    img.style.transform = "";
    img.classList.remove("zoomed-in");
  });
  overlay.style.display = "none";
});

function fadeIn(element) {
  var opacity = 0; // initial opacity
  element.style.visibility = "visible";
  var timer = setInterval(function () {
    if (opacity >= 1) {
      clearInterval(timer);
    }
    element.style.opacity = opacity;
    opacity += 0.06;
  }, 5);
}

function fadeOut(element) {
  return new Promise((resolve, reject) => {
    var opacity = 1; // initial opacity
    var timer = setInterval(function () {
      if (opacity <= 0) {
        clearInterval(timer);
        element.style.visibility = "hidden";
        resolve(); // Resolve the promise
      }
      element.style.opacity = opacity;
      opacity -= 0.06;
    }, 5);
  });
}

function loadJSON() {
  currentImage = 0;
  currentJSONFile = "iphoneText.json"; // Hardcoding the file selection to "iphoneText.json"

  fetch(currentJSONFile)
    .then((response) => response.json())
    .then((data) => {
      imageTexts = data;
      totalImages = imageTexts.length;
      console.log(imageTexts.length);
      changeImage();
    });
}

loadJSON();

function getPointIndex(imageIndex) {
  // Assuming totalImages is always greater than or equal to points.length
  let imagesPerPoint = Math.floor(totalImages / points.length);
  return Math.floor(imageIndex / imagesPerPoint);
}

function setImage(index) {
  let imgElement = document.querySelector(".img-container img"); // select your image element
  imgElement.src = `documiPhone/${index}.png`; // replace 'documiPhone/${index}.png' with the actual path to your images
}

async function changeImage() {
  if (isTransitionRunning) {
    return;
  }

  isTransitionRunning = true;
  await fadeOut(stepsContainer);

  let imageElements = document.querySelectorAll(".img-container img"); // select your image elements

  // Make sure there are the correct amount of image elements
  while (imageElements.length < imageTexts[currentImage].images.length) {
    let img = document.createElement("img");
    img.alt = "Image";
    document.querySelector(".img-container").appendChild(img);
    imageElements = document.querySelectorAll(".img-container img"); // update the array of image elements
  }

  // Device type
  document.querySelector(".deviceType").textContent =
    imageTexts[currentImage].deviceType;

  // HyperLink
  textElement.textContent = imageTexts[currentImage].title;
  let additionalInfoElement = document.querySelector(".additionalInfo");

  await fadeOut(additionalInfoElement);
  additionalInfoElement.innerHTML = imageTexts[currentImage].additionalInfo;

  // Update the sources of the image elements
  imageTexts[currentImage].images.forEach((image, index) => {
    if (imageElements[index]) {
      imageElements[index].src = image;
    }
  });

  textElement.textContent = imageTexts[currentImage].title;
  stepsContainer.innerHTML = "";

  let pointIndex = getPointIndex(currentImage);
  points[pointIndex].click();

  // Add new list elements for each subtext
  imageTexts[currentImage].subtexts.forEach((subtext, index) => {
    let li = document.createElement("ol");
    li.textContent = index + 1 + ". " + subtext;
    stepsContainer.appendChild(li);
  });

  setTimeout(function () {
    fadeIn(stepsContainer);
  }, 150);
  setTimeout(function () {
    fadeIn(additionalInfoElement);
  }, 150);

  console.log("changeImage()");
  isTransitionRunning = false;
}

function buttonTransition() {
  if (currentImage >= totalImages - 1) {
    nextButton.style.transform = "translateX(-120px)";
    nextButton.style.opacity = "0";
    nextButton.style.pointerEvents = "none";
    prevButton.style.right = "0";
  } else if (currentImage <= 0) {
    prevButton.style.transform = "translateX(0)";
    nextButton.style.transform = "translateX(-120px)";
    prevButton.style.opacity = "0";
    prevButton.style.pointerEvents = "none";
    nextButton.style.right = "0";
  } else {
    nextButton.style.transform = "translateX(0)";
    nextButton.style.opacity = "1";
    nextButton.style.pointerEvents = "auto";
    prevButton.style.transform = "translateX(0)";
    prevButton.style.opacity = "1";
    prevButton.style.pointerEvents = "auto";
    nextButton.style.right = "120px";
    prevButton.style.right = "120px";
  }

  if (currentImage < 0) {
    currentImage = totalImages - 1;
  }
  if (isTransitionRunning) {
    return;
  }
}

function nextImage() {
  if (isTransitionRunning) {
    return;
  }
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
  if (isTransitionRunning) {
    return;
  }
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

let points = document.querySelectorAll(".point-container");
let bars = document.querySelectorAll(".bar .inner-bar"); // select the inner bars
let previousPoint = null;
let previousIndex = 0;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

points.forEach((point, index) => {
  point.addEventListener("click", async function () {
    points.forEach((p) => {
      p.querySelector(".point").className = p
        .querySelector(".point")
        .className.replace(" highlighted", "");
      p.querySelector(".point-text").className = p
        .querySelector(".point-text")
        .className.replace(" first", "")
        .replace(" last", "");
    });

    if (this.classList.contains("disabled")) {
      return;
    }

    points.forEach((p) => {
      p.classList.add("disabled");
    });

    let imagesPerPoint = Math.floor(totalImages / points.length);
    currentImage = index * imagesPerPoint;

    if (!isTransitionRunning) {
      await changeImage();
    }

    points.forEach((p) => {
      p.classList.remove("disabled");
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
