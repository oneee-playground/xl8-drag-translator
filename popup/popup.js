const apiKeyForm = document.getElementById("api-key");
const input = apiKeyForm.getElementsByTagName("input")[0];
const button = apiKeyForm.getElementsByTagName("button")[0];

chrome.storage.local.get("api-key", (data) => {
    if (data["api-key"]) {
        input.value = data["api-key"];
    }
});

button.onclick = () => {
    chrome.storage.local.set({ "api-key": input.value });
};
