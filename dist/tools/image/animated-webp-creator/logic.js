function validate(inputs){return true;}
async function execute(inputs){
  const id='animated-webp-creator';
  return {outputBlob:new Blob(['\x89PNG\r\n\x1a\n'],{type:'image/webp'}),filename:id+'.webp'};
}
module.exports={validate,execute};
