
    import { Particle, Gene, cc, logger, EuglenaHasBeenBorn, netServer, Impulse, nucleus, fs} from "@euglena/core";
    import { sys, js } from "cessnalib";
    import { fsNodejsName, loggerConsoleName, netServerNodeJSName, vacuoleJsName, vacuoleMongoDBName } from "./particles";

    gene When server starts, print server port on console
    { meta: { class: "Log" } }
    t  p loggerConsoleName
    

    gene Checking Token Validity
    { meta: { class: "Impulse" } }
    rp = nucleus.cp.ReceiveParticle({
        particle: p,
        source: s
    })
    return t rp Nucleus

    gene When received particle ReadParticle
    { meta: { class: "ReadParticle" } }
    return t p vacuoleMongoDBName
    
    gene When received Base64File
    { meta: { class: "Base64File" } }
    pp = fs.v1.cp.WriteFile({
            filePath: "./uploads",
            content:
        },
        euglenaName
    ) 
    return t pp fsNodejsName
    
    gene When received particle RenameParticle
    { meta: { name: constants.particles.RenameParticle } }
    r = t p vacuoleMongoName
    if (r instanceof sys.type.Exception) {
        l = logger.cp.Log({
            message: r.message,
            type: verbose
        }) 
        t l loggerName
    }
    
    gene When received ReadParticle Proxy
    { meta: { name: constants.particles.ReadParticle }, data: { meta: { name: constants.particles.Proxy } } },
            (particle: ReadParticle, source, callback) => {
                let euglenaName = Cytoplasm.getParticle({ meta: { name: "EuglenaName" }, data: {} }).data;
                let proxyRef = particle.data;
                let proxies: particles.Proxy[] = Cytoplasm.getParticles(proxyRef);
                let returnProxy: particles.Proxy = null;
                for (let proxy of proxies) {
                    if (proxy.meta.expireTime > new Date().getTime()) {
                        returnProxy = proxy;
                    } else {
                        Cytoplasm.removeParticles(proxy);
                    }
                }
                if (returnProxy) {
                    let impact = new euglena.interaction.Impact(returnProxy, "token", euglenaName);
                    let impactReceived = Cytoplasm.getParticle({
                        meta: { name: "Impact" },
                        data: {
                            particle: particle
                        }
                    });
                    let to = Cytoplasm.getParticle(reference(constants.particles.EuglenaInfo, impactReceived.meta.of));
                    Cytoplasm.transmit(constants.organelles.NetOrganelle, new particles.ThrowImpact({ to, impact }, euglenaName));
                }
            },
            "When received particle ReadParticle"
        ),
        new Gene(
            "When received SaveParticle send it to DbOrganelle if it is from clients",
            { meta: { name: constants.particles.SaveParticle }, data: {} },
            (particle: euglena_template.alive.particle.SaveParticle) => {
                /**
                 * insert new particle into db
                 */
                Cytoplasm.transmit(constants.organelles.DbOrganelle, particle);
            }
        ),
        new Gene(
            "When received SaveParticle of Page, delete unnecessary versions then save it into the db",
            { meta: { name: constants.particles.SaveParticle } },
            (particle: euglena_template.alive.particle.SaveParticle) => {
                /**
                 * get euglenaName from Cytoplasm
                 */
                let euglenaName = Cytoplasm.getParticle({ meta: { name: "EuglenaName" }, data: {} }).data;
                /**
                 * read all particles matched from db
                 */
                Cytoplasm.transmit(
                    constants.organelles.DbOrganelle,
                    new euglena_template.alive.particle.ReadParticles(particle.data.query, euglenaName),
                    (particles: particles.Particles) => {
                        /**
                         * Sort fetched particles by creation date
                         */
                        const sorted = particles.data.sort((p: euglena.ParticleV2<any>) => p.meta.createTime);
                        /**
                         * remove oldest particle
                         */
                        Cytoplasm.transmit(
                            constants.organelles.DbOrganelle,
                            new euglena_template.alive.particle.RemoveParticle({ meta: { ...sorted[sorted.length - 1].meta } }, euglenaName)
                        );
                        /**
                         * insert new particle into db
                         */
                        Cytoplasm.transmit(constants.organelles.DbOrganelle, particle);
                    }
                );
            },
            "When received SaveParticle send it to DbOrganelle if it is from clients"
        ),
        new Gene(
            "When received RemoveParticle send it to DbOrganelle if it is from clients",
            { meta: { name: constants.particles.RemoveParticle }, data: {} },
            (particle: euglena_template.alive.particle.RemoveParticle) => {
                Cytoplasm.transmit(constants.organelles.DbOrganelle, particle);
            }
        ),
        new Gene(
            "When received RemoveParticle Proxy",
            { meta: { name: constants.particles.RemoveParticle }, data: { meta: { name: constants.particles.Proxy } } },
            (particle: euglena_template.alive.particle.RemoveParticle) => {
                Cytoplasm.removeParticles(particle.data);
            },
            "When received RemoveParticle send it to DbOrganelle if it is from clients"
        ),
        new Gene(
            "When received EuglenaInfo save it into particles",
            { meta: { name: constants.particles.EuglenaInfo } },
            (particle: particles.EuglenaInfo) => {
                Cytoplasm.saveParticle(particle);
            }
        ),
        new Gene(
            "When received Authenticate",
            { meta: { name: "Impact" }, data: { particle: { meta: { name: constants.particles.Authenticate } } } },
            (particle, source) => {
                let token = "";
                let euglenaName = Cytoplasm.getParticle({ meta: { name: "EuglenaName" }, data: {} }).data;
                let from = particle.meta.of;
                let authenticate = particle.data.particle;
                Cytoplasm.transmit(
                    constants.organelles.DbOrganelle,
                    new particles.ReadParticles({ meta: { name: constants.particles.Password, of: authenticate.data.euglenaName } }, euglenaName),
                    (particle: Particle) => {
                        particle = (particle.data as particles.Password[])[0];
                        let to = Cytoplasm.getParticle({ meta: { name: constants.particles.EuglenaInfo }, data: { name: from } });
                        if (particle.meta.name === constants.particles.Password) {
                            if (authenticate && authenticate.data.password === particle.data) {
                                let proxy = new particles.Proxy(
                                    authenticate.data.euglenaName,
                                    from,
                                    new Date().getTime() + sys.type.StaticTools.TimeSpan.toUnixTimestamp(new sys.type.TimeSpan(0, 1, 0, 0, 0)),
                                    euglenaName
                                );
                                Cytoplasm.saveParticle(proxy);
                                let impact = new euglena.interaction.Impact(proxy, "token", euglenaName);
                                Cytoplasm.transmit(constants.organelles.NetOrganelle, new particles.ThrowImpact({ to, impact }, euglenaName));
                            }
                        } else {
                            Cytoplasm.transmit(
                                constants.organelles.NetOrganelle,
                                new particles.ThrowImpact(
                                    {
                                        to,
                                        impact: new euglena.interaction.Impact(
                                            new particles.Exception(new sys.type.Exception("Error occured while the execution"), euglenaName),
                                            token,
                                            euglenaName
                                        )
                                    },
                                    euglenaName
                                )
                            );
                        }
                    }
                );
            },
            "Checking Token Validity"
        );
});
