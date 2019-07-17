# gear-pla
Planaria instance for contract state updates and event driven storage.
![engine](engine.jpg)
___

### RUN

1. Include emscripten javascript output `a.out.js` from [gear-contracts](https://github.com/gear-sv/gear-contracts).
2. Start bitbus server. See [gear-bus](https://github.com/gear-sv/gear-bus) for instructions.
3. Point planaria `src` at the bus output directory `bus/[hash]`
3. `npm run start`

___
