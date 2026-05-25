import "./components/UserDashboard.js";

document.body.style.margin = "0";
document.body.style.minHeight = "100vh";

if (!document.querySelector("user-dashboard")) {
	document.body.innerHTML = "<user-dashboard></user-dashboard>";
}
