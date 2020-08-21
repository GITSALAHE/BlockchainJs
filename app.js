var CryptoJS = require("crypto-js");

//Build our block 
class Block{
    constructor(prevHash, txs, nonce){
        this.prevHash = prevHash;
        this.txs = txs;
        this.nonce = nonce;
        this.time = Date.now()
    }
    getHash(){
        return CryptoJS.SHA256(this.prevHash + this.getMerkleHash() + this.nonce + this.time + '').toString();
    }
    getMerkleHash(){
        return this.txs.toString();
    }
}

class Blockchain{
    constructor(genesisBlock){
        this.blocks = new Array();
        this.blocks[genesisBlock.getHash()] = genesisBlock;
    }
    mineBlock(){
        let nonce = Math.floor(Math.random() * 1000) + 1;
        let block = new Block(this.getLastBlock().getHash(), ['1', '2'], nonce);
        this.blocks[block.getHash()] = block;
    }   
    getLastBlock(){
        let key = Object.keys(this.blocks)[Object.keys(this.blocks).length -1];
        return this.blocks[key];
    }
}

let genesisBlock = new Block(null, ['genisis', 'block'], 1);
let blockchain = new Blockchain(genesisBlock);
console.log(blockchain.getLastBlock().getHash())
;blockchain.mineBlock();
console.log(blockchain.getLastBlock(), blockchain.getLastBlock().getHash())