Instead of calling genes a function and getting the result into another gene. 


Suggested approach

Returning some value from a gene will be encapsulated with Particles. This is because handling Receive particle in Nucleus can trigger multiple genes. And these multiple genes can return multiple values. So you will obtain a Particles particle contains all theese returned values. But you can not able to understand which particle is which gene's response. So returning a value from a gene is not a clever idea. You can assume there is a one gene to respond and you can just get first particle from Particles particle as response. But Then your gene would have an idea of the outside world. It is assuming that there is one gene being respond to its particle throw.

If each gene triggers something else or calls organelles and not return anything then you dont need to deal with Particles particle and responses. You would be knowing how to proceed.

For example:

Http request handling
--------------------------------

==Impulse{token,particle}==> [organelle.net-server] ==Pulse{token,particle,id}==> [gene.authentication] ==AuthenticatedPulse{user,particle,id}==> [gene.authorization] ==AuthorizedPulse{particle,id}==> [gene.custom] ==ResponsePulse{responseParticle,id}==> [organelle.net-server]

Gene.custom
--------------------------------



Deprecated
-------------------------------------------

**Bad approach**

    call sequance 1-2-1

gene-something

    do something
    returnValue = gene-check-authenticate()
    do something with returnValue
    return something

gene-check-authenticate

    check authenticate
    return value


**Good approach**

    call sequence 1-2

gene-check-authenticate

    check authenticate
    return gene-something()

gene-something
    do something
    return something