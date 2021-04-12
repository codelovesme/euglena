## Euglena
<img src="docs/euglena.png" alt="Euglena" width="20%" align="left"/>

Euglena is an event driven architecture with enhanced side features. Mostly focused onto those below difficulties:

* Dependency injection
* Code reusability
* Logic reusability
* Logic update at runtime

An euglena application consists of three main part. Organelles, Chromosome, Particles.

Organelles are functionalities of the application. Such as birds need wings to fly, euglenas need organelles to do something.
As well as an euglena in the mother nature has flagellum organelle to move around, vacuole organelle to keep waste together, mitocondri organelle to produce ATP,
in the digital nature here an euglena has net-server organelle to listen requests, vacuole organelle again to store particles, logger organelle to log. 

Straight forward right ?

Except for two, all organelles are not necessarily needed to be included in a euglena application. These two organelles are endoplasmic reticulum and nucleus. Whereas endoplasmic reticulum is responsible from delivery of particles, nucleus keeps chromosome (genes) and trigger actions corresponding to a gene when a particle is received.

![Euglena inside](docs/euglena-inside.png)



### Packages

[@euglena/cli](packages/cli/README.md)

[@euglena/core](packages/core/README.md)

[@euglena/organelle.gps.serial-port](packages/organelle.gps.serial-port/README.md)

[@euglena/organelle.logger.console](packages/organelle.logger.console/README.md)

[@euglena/organelle.matter.plantower](packages/organelle.matter.plantower/README.md)

[@euglena/organelle.net-client.browser](packages/organelle.net-client.browser/README.md)

[@euglena/organelle.net-client.nodejs](packages/organelle.net-client.nodejs/README.md)

[@euglena/organelle.temperature.i2c](packages/organelle.temperature.i2c/README.md)

[@euglena/organelle.timer.js](packages/organelle.timer.js/README.md)

[@euglena/organelle.ui.react](packages/organelle.ui.react/README.md)

[@euglena/organelle.vacuole.js](packages/organelle.vacuole.js/README.md)

[@euglena/organelle.vacuole.mongodb](packages/organelle.vacuole.mongodb/README.md)

[@euglena/organelle.vacuole.nedb](packages/organelle.vacuole.nedb/README.md)
