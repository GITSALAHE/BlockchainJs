function toHex(val) {
	return val.toString(16);
}

class Block {

	constructor(txs, nonce, prevBlock) {
  	this.txs = txs;
    this.nonce = nonce;
    this.prevBlockHash = prevBlock;
		this.timestamp = Date.now();
  }
  
  getMerkle() {
  	return CryptoJS.SHA256(this.txs.toString()).toString();
  }
  
  getHash() {
  	return CryptoJS.SHA256(
    	'01000000'
    	+ this.prevBlockHash
      + this.getMerkle()
      + toHex(this.timestamp)
      + '1'
      + toHex(this.nonce)
    ).toString();
  }
  
  renderInfo() {
	document.querySelector('#block-hash').innerHTML = this.getHash();
    document.querySelector('#prev-hash-info').innerHTML = this.prevBlockHash;
    document.querySelector('#date-info').innerHTML = this.timestamp;
    document.querySelector('#tx-info').innerHTML = this.txs.toString().replace(/,/g, '<br/>');
  }
}

class Blockchain {

	constructor(genesisBlock) {
		this.blocks = new Array();
    this.blocks[genesisBlock.getHash()] = genesisBlock;
    
    this.render(genesisBlock);
  }
  
  mineNewBlock(txs) {
	let nonce = Math.floor(Math.random() * 4294967294) + 1;
    let minedBlock = new Block(txs, nonce, this.getLastBlock().getHash());
    this.blocks[minedBlock.getHash()] = minedBlock;
    
    this.render(minedBlock);
  }
  
  render(newBlock) {
    let node = document.querySelector('#blockchain');
    
    let blocNode = document.createElement('div');
    let lastNode = node.lastChild;
    
		blocNode.classList.add('block');
    blocNode.setAttribute('onClick', 'blockchain.getLastBlock(this)');
    blocNode.onclick = (function(node) {
    	this.selectBlock(newBlock.getHash(), node.srcElement);
    }).bind(this);
    
    node.appendChild(blocNode);
    
    if (!newBlock.prevBlockHash) {
    	newBlock.renderInfo();
      blocNode.classList.add('selected');
      return;
    }
    
		lastNode.classList.add('with-next-block');		
  }
  
  selectBlock(blockHash, node) {
  	let selectedNode = document.querySelector('.selected');
    selectedNode.classList.remove('selected');
    node.classList.add('selected');
    this.blocks[blockHash].renderInfo();
  }
  
  getLastBlock() {
  	let key = Object.keys(this.blocks)[Object.keys(this.blocks).length - 1];
  	return this.blocks[key];
  }
  
	prevBlockFrom(currentBlock) {
  	return this.blocks[currentBlock.prevBlockHash];
  }
}

let genesisBlock = new Block(['genesis', 'block'], 1, null);

let blockchain = new Blockchain(genesisBlock);

let generator;

function genTxs() {
  let nbTx = Math.floor(Math.random() * 10);
  let txs = new Array(nbTx);
  for (let i = 0; i < nbTx; i++) {
  	let n = Math.floor((Math.random() * 1000000000) + 1);
    txs[i] = CryptoJS.SHA256(n + '').toString();
  }
  return txs;
}

document.querySelector('#btn-gen').onclick = function() {
	if (!generator) {
  	this.innerHTML = 'Stop auto gen';
    generator = setInterval(() => {
      blockchain.mineNewBlock(genTxs());
    }, 2500);  
  } else {
  	this.innerHTML = 'Start auto gen';
 		clearInterval(generator); 
    generator = null;
  }
}

document.querySelector('#btn-next').onclick = function() {
	blockchain.mineNewBlock(genTxs());
}
