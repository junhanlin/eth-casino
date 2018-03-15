Eth Casino
===============

Prerequisite
---------------

* Install `truffle` globally

```
$ npm install -g truffle 
```

* Create truffle configuration file `truffle.js` 

```
# create from example
$ cp truffle.example.js truffle.js

# modify truffle.js:  fill in your mnemonic and your INFURA api key
```

* Install project dependency

```
$ npm install
```

Development
---------------

* Compile contracts and deploy to ropsten network

> You should do this everytime you modifiy the contracts

```
$ npm run migrate
``` 




* Start frontend http development server (port: 8000)

```
$ npm run start
```



