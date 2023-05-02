function selectAllTasks() {
  const selectAll = document.getElementById("select-all");
  const tasksList = document.getElementById("tasks-list").children;
  if (selectAll.checked) {
    for (let i = 0; i < tasksList.length; i++) {
      tasksList[i].children[0].checked = true;
    }
  } else {
    for (let i = 0; i < tasksList.length; i++) {
      tasksList[i].children[0].checked = false;
    }
  }
}

function showConfig() {
  const modal = document.getElementById("modal-delete");
  if (modal.style.display === "flex") {
    modal.style.display = "none";
  } else {
    modal.style.display = "flex";
  }
}
