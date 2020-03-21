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
!!