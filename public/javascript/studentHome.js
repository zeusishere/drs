function registerListenersToAddCommentBtns() {
  let addCommentBtns = document.getElementsByClassName("add-comment-btn");
  for (element of addCommentBtns) {
    element.addEventListener("click", makeAReqToAddCommentToDatabase);
    console.log(element);
  }
}
function makeAReqToAddCommentToDatabase(event) {
  let commentText = event.target.previousElementSibling.value;
  let doubtId = event.target.getAttribute("data-doubtId");

  let data = { commentText, doubtId };
  //   let xmlReq = new XMLHttpRequest();
  fetch("/student/add-comment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("data is ", data);
      if (data.success) {
        //   add comment to DOM
        let commentContainer = document.getElementById(
          `comments-container-${doubtId}`
        );
        addCommentToDom(commentContainer, data.data, doubtId);
        showNotificationOnScreen("success", "successfully added comment");
        // clear the comment input box
        event.target.previousElementSibling.value = "";
      } else {
        showNotificationOnScreen(
          "error",
          "There was some error while trying to add comment."
        );
      }
    });
}
function addCommentToDom(commentContainer, data, doubtId) {
  let newComment = `<div class="px-3 py-1 mb-2 bg-color-grey-light
  border border-2 border-secondary ">
    ${data.user} :${data.comment}
  </div>`;
  commentContainer.innerHTML = newComment + commentContainer.innerHTML;
  // update total comments for Post
  let commentsCount = document.getElementById(`comments-count-${doubtId}`);
  commentsCount.innerHTML = parseInt(commentsCount.innerHTML) + 1 + " comments";
}

function showNotificationOnScreen(notificationType, message) {
  new Noty({
    theme: "relax",
    text: `${message}`,
    type: `${notificationType}`,
    layout: "topRight",
    timeout: 1000,
    progressBar: true,
  }).show();
}
registerListenersToAddCommentBtns();
