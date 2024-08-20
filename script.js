$(document).ready(function () {
  // Object to store assigned images for each email
  const assignedImages = {};

  // Function to fetch a random image
  function fetchRandomImage() {
    return new Promise((resolve) => {
      const newSrc = `https://picsum.photos/800/600?random=${Date.now()}`;
      const img = new Image();
      img.onload = function () {
        $("#currentImage").attr("src", newSrc);
        resolve(newSrc);
      };
      img.src = newSrc;
    });
  }

  // Function to display all assigned images
  function displayAssignedImages() {
    const $assignedImages = $("#assignedImages").empty();

    Object.entries(assignedImages).forEach(([email, images]) => {
      const $emailGroup = $("<div>").addClass("email-group mb-3");
      const $emailHeader = $("<div>").addClass("d-flex justify-content-between align-items-center");

      $emailHeader.append($("<h3>").text(email));
      $emailHeader.append(
        $("<button>")
          .addClass("btn btn-danger btn-sm")
          .text("Reset")
          .on("click", function () {
            delete assignedImages[email];
            displayAssignedImages();
          })
      );

      $emailGroup.append($emailHeader);

      const $imageGrid = $("<div>").addClass("image-grid");
      images.forEach((imageUrl) => {
        $imageGrid.append($("<img>").attr("src", imageUrl).addClass("img-thumbnail"));
      });

      $emailGroup.append($imageGrid);
      $assignedImages.append($emailGroup);
    });
  }

  // Function to show error message with animation
  function showError(message) {
    const $errorMessage = $("#errorMessage");
    $errorMessage.text(message).addClass("show");

    $errorMessage[0].offsetHeight;

    setTimeout(() => {
      $errorMessage.removeClass("show");
    }, 3000);
  }

  // Function to validate email address
  function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(String(email).toLowerCase());
  }

  // Event handler for form submission
  $("#emailForm").on("submit", function (formEvent) {
    formEvent.preventDefault();
    const email = $("#emailInput").val().toLowerCase();
    const currentImageUrl = $("#currentImage").attr("src");

    if (!validateEmail(email)) {
      showError("Please enter a valid email address.");
      return;
    }

    if (currentImageUrl) {
      if (!assignedImages[email]) {
        assignedImages[email] = [];
      }

      if (assignedImages[email].includes(currentImageUrl)) {
        showError("This image has already been assigned to this email address.");
      } else {
        assignedImages[email].push(currentImageUrl);
        displayAssignedImages();
        $("#emailInput").val("");
      }
    }
  });

  // Event handler for next button click
  $("#nextButton").on("click", function () {
    fetchRandomImage();
  });

  // Initial image fetch on page load
  fetchRandomImage();
});
