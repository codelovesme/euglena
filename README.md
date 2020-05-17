TODO List

-   auto particle create particle generate

** old version **

```javascript
export default domc("NetClient", {
    incoming: {
        TransmitParticle: (data: {
            particle: Particle,
            target: {
                host: string,
                port: number
            }
        }) => cp("TransmitParticle", data)
    },
    outgoing: {
        ...
    }
});
```

** must be version **

```javascript
export default domc("NetClient", {
    incoming: {
        TransmitParticle: {
            particle: Particle,
            target: {
                host: string,
                port: number
            }
        }
    },
    outgoing: {
        ...
    }
});
```

### Packages

[@euglena/cli](packages/cli/README.md)

[@euglena/core](packages/core/README.md)

[@euglena/organelle.gps](packages/organelle.gps/README.md)

[@euglena/organelle.gps.serial-port](packages/organelle.gps.serial-port/README.md)

[@euglena/organelle.logger](packages/organelle.logger/README.md)

[@euglena/organelle.logger.console](packages/organelle.logger.console/README.md)

[@euglena/organelle.matter](packages/organelle.matter/README.md)

[@euglena/organelle.matter.plantower](packages/organelle.matter.plantower/README.md)

[@euglena/organelle.net-client](packages/organelle.net-client/README.md)

[@euglena/organelle.net-client.browser](packages/organelle.net-client.browser/README.md)

[@euglena/organelle.net-client.node](packages/organelle.net-client.node/README.md)

[@euglena/organelle.net-server](packages/organelle.net-server/README.md)

[@euglena/organelle.temperature](packages/organelle.temperature/README.md)

[@euglena/organelle.temperature.i2c](packages/organelle.temperature.i2c/README.md)

[@euglena/organelle.timer](packages/organelle.timer/README.md)

[@euglena/organelle.timer.js](packages/organelle.timer.js/README.md)

[@euglena/organelle.ui](packages/organelle.ui/README.md)

[@euglena/organelle.ui.react](packages/organelle.ui.react/README.md)

[@euglena/organelle.vacuole](packages/organelle.vacuole/README.md)

[@euglena/organelle.vacuole.js](packages/organelle.vacuole.js/README.md)

[@euglena/organelle.vacuole.mongo](packages/organelle.vacuole.mongo/README.md)

[@euglena/organelle.vacuole.nedb](packages/organelle.vacuole.nedb/README.md)
