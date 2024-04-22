const usernameInput = document.querySelector("#username-input");

// function use to change URL to other pages.
function goToWithCheckInput(URL) {
    console.log(usernameInput.value);
    if (!usernameInput.value) {
        alert("please fill your username first");
    } else {
        window.location.href = URL;
    }
}
