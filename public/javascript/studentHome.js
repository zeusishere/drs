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
  console.log(doubtId);
  console.log(commentText);
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
        console.log(commentContainer);
        addCommentToDom(commentContainer, data.data);
      }
    });
}
function addCommentToDom(commentContainer, data) {
  console.log(data);
  let newComment = `<div class="px-3 py-1 mb-2">
    ${data.user} :${data.comment}
  </div>`;
  console.log(newComment);
  commentContainer.innerHTML = newComment + commentContainer.innerHTML;
}
registerListenersToAddCommentBtns();
