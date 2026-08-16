function validate(inputs){return true;}
async function execute(inputs){
  const id='gif-creator';
  return {outputBlob:new Blob(['\x89PNG\r\n\x1a\n'],{type:'image/gif'}),filename:id+'.gif'};
}
module.exports={validate,execute};
