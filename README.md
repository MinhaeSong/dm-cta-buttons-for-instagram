# DM CTA Buttons for Instagram

**English** | [한국어](README.ko.md)

**Render the hidden CTA buttons in Instagram DMs on desktop web, and click them without picking up your phone.**

Got an automated DM saying *"Tap the button below to get the link!"* but there's no button on instagram.com? Comment-to-DM tools like ManyChat send messages with CTA buttons (postback buttons, URL buttons, button templates, generic templates, quick replies), and Instagram only renders them in the mobile app. On desktop you see the text and nothing to click.

This Chrome extension brings those buttons back.

| Instagram desktop web (before) | With this extension |
|---|---|
| Message text only, no button | CTA buttons rendered under the message, clickable |

## Who it's for

- You commented on a creator's post, got an auto-DM, and the "Send me the link" button is missing on desktop
- Instagram DM buttons, quick replies or link buttons don't show or don't work on your laptop
- You manage DMs on desktop and keep reaching for your phone just to tap one button

## Features

- **Postback buttons**: buttons like "Send me the link!" or "I followed 🙌" appear under the message. Clicking one sends the postback exactly as tapping it in the mobile app would.
- **URL buttons**: open in a new tab.
- **Works in every thread**: buttons are added automatically as you move between conversations.
- **No setup, no servers**: runs entirely inside the Instagram tab. No data leaves the page.

## Install

1. Click the green **Code** button on this page and choose **Download ZIP**.
2. Unzip the file.
3. Open `chrome://extensions` and turn on **Developer mode** (top right).
4. Click **Load unpacked** and select the unzipped folder (the one containing `manifest.json`).
5. Reload your [Instagram DMs](https://www.instagram.com/direct/inbox/).

Works on Chrome, Edge, Brave, Whale and other Chromium-based browsers.

## Why are the buttons missing on desktop?

Meta's developer docs state that [button templates](https://developers.facebook.com/documentation/business-messaging/instagram-messaging/button-template), [generic templates](https://developers.facebook.com/documentation/business-messaging/instagram-messaging/generic-template) and [quick replies](https://developers.facebook.com/documentation/business-messaging/instagram-messaging/features/quick-replies) are not supported on the web version of Instagram.

In practice, Instagram Web already receives the button data (`cta_buttons`) for these messages, and its JavaScript bundle even ships a postback button component and mutation (`IGDGenericTemplatePostbackCTAButtonOffMsysMutation`). It just never renders them.

This extension reads the CTA data already present in the page's Relay store, renders the buttons under each message, and calls Instagram Web's own postback mutation when you click.

## Caveats

- Relies on undocumented Instagram internals. It may break when Instagram updates its web app.
- If sending fails, the button shows a failure message. Use the mobile app for that message.
- Clicking a postback button sends the button text to the other account as a message.
- Built for personal use. You are responsible for complying with Instagram's Terms of Use. Not affiliated with Meta or Instagram.

## Troubleshooting

Open an [issue](../../issues) describing what happened. If the Chrome DevTools console (F12) shows errors starting with `[DM CTA]`, please include them.

---

Keywords: instagram dm button not showing desktop, instagram web dm buttons, instagram quick reply desktop, manychat button not working desktop, instagram postback button, instagram cta button chrome extension, instagram button template web, comment to dm button missing
