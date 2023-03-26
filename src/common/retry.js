export async function retryOperation(fn, params, retrys){
  let currentTry = 0;
  console.log('Start')
  while(true){
    console.log('Try')
    try {
      await fn(params)
      console.log('Succeeded!')
      break
    } catch (error) {
      currentTry++
      if (currentTry >= retrys) {
        console.log('Timeout')
        break
      }
    }
    await sleep(1000)
  }
  
}

async function sleep(ms){
  return new Promise(resolve =>{
    setTimeout( ()=>{
      resolve()
    }, ms)
  })
}

function externalCall(){
  let res = Math.random() < 0.3
  if (res) {
    throw 'Failure'
  }
  return res
}