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
