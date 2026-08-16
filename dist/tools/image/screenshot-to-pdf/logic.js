function validate(inputs){return true;}
async function execute(inputs){
  const id='screenshot-to-pdf';
  return {outputBlob:new Blob(['%PDF-1.4'],{type:'application/pdf'}),filename:id+'.pdf'};
}
module.exports={validate,execute};
