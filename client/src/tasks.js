const htmlTask = (id, name, tags, isStarred) => {
  return `<div class="row-task" id="task-${id}">
              <input class="grid-size" type="checkbox" />
              <span class="name-task grid-size">${name}</span>
              <div class="tags-container grid-size">
                  ${tags
                    .map((tag) => `<span class="tag-task">${tag}</span>`)
                    .join("")}
              </div>
              <div class="tags-container grid-size">
                  <span class="fa fa-star task-star ${
                    isStarred ? "task-star-checked" : null
                  }" onclick="toggleStarTask(this, ${id})"></span>
              </div>
          </div>`;
};

const verifyTaskForm = (formObj) => {
  if (formObj["name-task"] == "" || formObj["tags-task"] == "") {
    return false;
  }
  return true;
};

const convertTaskForm = (form) => {
  let data = new FormData(form);
  let formObj = Object.fromEntries(data);

  formObj["tags-task"] = formObj["tags-task"].split(",");
  const selectedTab = getActiveTabName();
  formObj["isStarred"] = false;
  if (selectedTab === "star") {
    formObj["isStarred"] = true;
  }
  return formObj;
};

function addHtmlTask(formObj) {
  let htmlRow = htmlTask(
    formObj["id"],
    formObj["name-task"],
    formObj["tags-task"],
    formObj["isStarred"]
  );
  document.getElementById("tasks-list").innerHTML += htmlRow;
}
