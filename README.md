# funding
Funding base smart contracts


```
    anchor build
```

# Deploiement

````
    solana address -k ./target/deploy/ribhfunding-keypair.json
```

And copy-paste the generated program key in lib.rs and Anchor.toml files


## Generate a new key to deploy

````
    solana-keygen new -o id.json
```


## Airdrop some SOL

````
    solana airdrop 2 _pubkey_
```


