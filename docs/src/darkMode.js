const color = (theme) => (attr) => `--${theme}-${attr}-color`;
const dark = color("dark");
const light = color("light");
const attrs = ["bg", "text", "border", "input", "checkbox-opacity"];

function changeTheme(theme) {
  const root = document.querySelector(":root");
  const colorMode = theme === "dark" ? dark : light;
  attrs.forEach((attr) => {
    root.style.setProperty(
      color("main")(attr),
      getColorFromRoot(colorMode(attr))
    );
  });
}

function switchButton() {
  const button = document.getElementById("switch");
  const theme = button.checked ? "dark" : "light";
  changeTheme(theme);
  localStorage.setItem("colorMode", theme);
}

function getColorFromRoot(variable) {
  return getComputedStyle(document.documentElement).getPropertyValue(variable);
}
if (localStorage.getItem("colorMode")) {
  changeTheme(localStorage.getItem("colorMode"));
}
