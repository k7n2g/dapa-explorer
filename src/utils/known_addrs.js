 
 import { reduceText } from '.'

export const pools = {
   }

export const exchanges = {

   
}

export const misc = {
  
  }


export const addrs = { ...pools, ...exchanges, ...misc }

export const formatAddr = (addr) => {
  if (pools[addr]) {
    return pools[addr].name
  }

  if (exchanges[addr]) {
    return exchanges[addr].name
  }

  if (misc[addr]) {
    return misc[addr].name
  }

  return reduceText(addr, 0, 7)
}

export const formatMiner = (miner) => {
  if (pools[miner]) {
    return pools[miner].name
  }

  return reduceText(miner, 0, 7)
}