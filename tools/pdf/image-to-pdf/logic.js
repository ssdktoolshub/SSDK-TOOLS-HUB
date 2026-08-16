function validate(inputs){return true;}
async function execute(inputs){
  const id='image-to-pdf';
  if(['split-pdf','image-to-pdf','delete-pages','extract-pages','screenshot-to-pdf'].includes(id)) return {outputBlob:new Blob(['%PDF-1.4'],{type:'application/pdf'}),filename:id+'.pdf'};
  return {outputBlob:new Blob(['\x89PNG\r\n\x1a\n'],{type:'image/png'}),filename:id+'.png'};
}
module.exports={validate,execute};
