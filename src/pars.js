
function readUint16(byteArray, offset) {
  const view = new DataView(byteArray.buffer);
  return view.getUint16(offset, true);
}

function readUint32(byteArray, offset) {
  const view = new DataView(byteArray.buffer);
  return view.getUint32(offset, true);
}

function readAscii(byteArray, offset, length) {
  const decoder = new TextDecoder('ascii');
  const slice = byteArray.slice(offset, offset + length);
  return decoder.decode(slice);
}

function parseDicom(dicomData){
  let dataSet = []
  let dataDict = {}
  const byteArray = dicomData;
  let offset = 0;
  const b16 = ['AE','AS','AT','CS','DA','DS','DT','FL','FD','IS','LO','LT','PN','SH','SL','SS','ST','TM','UI','UL','US'];
  while (offset < byteArray.length){
    let tag = `x${readUint16(byteArray, offset).toString(16)}` +','+
    `${readUint16(byteArray, offset + 2).toString(16)}`;
    offset+=4
      let vr = readAscii(byteArray, offset, 2);
      offset+=2
      let length
      let value
      if (b16.includes(vr)) {
        length = readUint16(byteArray,offset)
        offset+=2

        value = byteArray.slice(offset, offset + length)
      }else{
        offset+=2
        length = readUint32(byteArray, offset)
        offset+=4
        value = byteArray.slice(offset, offset + length)
          if(vr === 'SQ'){
            dataDict=Object.assign({}, dataDict, 
              parseDicom(byteArray.slice(offset+8, offset + length)))
            dataSet=dataSet.concat(parseDicom(byteArray.slice(offset+8, offset + length)))
          }
      }
      offset+=length
      dataSet.push([tag,vr,length,value])
      dataDict[tag]=[vr,length,value]
  }
  return dataDict
}
export default parseDicom;

