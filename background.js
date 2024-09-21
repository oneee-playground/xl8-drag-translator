async function translate(src, dst, content) {
    const apiKey = (await chrome.storage.local.get("api-key"))["api-key"];

    const response = await fetch("https://api.xl8.ai/v1/trans/request/rt", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            source_language: src,
            target_language: dst,
            sentences: [content],
        }),
    });

    if (!response.ok) {
        throw new Error(`${response.statusText}: ${await response.json()}`);
    }

    const data = await response.json();

    return data["sentences"][0];
}

const contextMenuId = "xl8translate";

chrome.contextMenus.create({
    id: contextMenuId,
    contexts: ["selection"],
    title: "Translate with XL8",
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === contextMenuId && info.selectionText) {
        if (tab && tab.id) {
            const translated = await translate("en", "ko", info.selectionText);

            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: (translated) => {
                    window.dispatchEvent(
                        new CustomEvent("xl8translated", {
                            detail: translated,
                        })
                    );
                },
                args: [translated],
            });
        }
    }
});
