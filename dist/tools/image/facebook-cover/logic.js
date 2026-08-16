function validate(inputs){return true;}
async function execute(inputs){
  const id='facebook-cover';
  return {outputBlob:new Blob(['\x89PNG\r\n\x1a\n'],{type:'image/png'}),filename:id+'.png'};
}
module.exports={validate,execute};
