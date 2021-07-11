# super-poker

_Minimalist planning poker web app_

The web app requires a running [Super Poker WebSocket Server](https://github.com/amm0nite/super-poker-server) to work.

## Build

Files are produced with `webpack`.

Required environment variables:
- SERVER_URL: WebSocket server URL (`wss://example.com`)
- URL: base URL to use for the room link (`https://example.com`)

Build command:
```bash
npm run build
```
