const tags = ['x20,13','x28,10','x28,11','x28,30',
              'x18,50','x18,88','x20,32','x28,100',
              'x28,101','x28,1050','x28,1051','x28,1052',
              'x28,1053','x7fe0,10']
const TRANSFER_SYNTAX='x2,10'
const PIXEL_REPRESENTATION = 'x28,103'
let LE = null
let PIXEL = null
              function readUint8(data, length) {
                let ar = []
                for (let i=0; i<length; i++){
                  ar.push(data.getUint8(i, LE))
                }
                return ar.join(', ')
              }
              
              function readUint16(data, length) {
                let ar = []
                for (let i=0; i<length; i+=2){
                  ar.push(data.getUint16(i, LE))
                }
                return ar.join(', ')
              }
              
              function readInt16(data, length) {
                let ar = []
                for (let i=0; i<length; i+=2){
                  ar.push(data.getInt16(i, LE))
                }
                return ar.join(', ')
              }
              
              function readFloat(data, length) {
                let ar = []
                for (let i=0; i<length; i+=8){
                  ar.push(data.getFloat64(i, LE))
                }
                return ar.join(', ')
              }
              
              function readFloat32(data, length) {
                let ar = []
                for (let i=0; i<length; i+=4){
                  ar.push(data.getFloat32(i, LE))
                }
                return ar.join(', ')
              }
              
              function readInt32(data, length) {
                let ar = []
                for (let i=0; i<length; i+=4){
                  ar.push(data.getInt32(i, LE))
                }
                return ar.join(', ')
              }
              
              function readUint32(data, length) {
                let ar = []
                for (let i=0; i<length; i+=4){
                  ar.push(data.getUint32(i, LE))
                }
                return ar.join(', ')
              }
              
              function readAscii(byteArray, offset, length) {
                const decoder = new TextDecoder('ascii')
                const slice = byteArray.slice(offset, offset + length)
                return decoder.decode(slice)
              }

const numberVR = ['OB','US','UL','SS','SL','FD','FL']
const changeFormat = (vr, len, bValue) => {
    let value
    if(numberVR.includes(vr)){
        const view = new DataView(bValue.buffer)
        if(vr === 'FD'){
            value = readFloat(view, len)
        } else if(vr === 'SS'){
            value = readInt16(view, len)
        } else if(vr === 'SL'){
            value = readInt32(view, len)
        } else if(vr === 'FL'){
            value = readFloat32(view, len)
        } else if(vr === 'US'){
            value = readUint16(view, len)
        } else if(vr === 'UL'){
            value = readUint32(view, len)
        } else if(vr === 'OB'){
            value = readUint8(view, len)
        }
    } else {
        const decoder = new TextDecoder('ascii')
        value  = decoder.decode(bValue)
    }
    return value
}

function charChange(c){
    let cc = c.charCodeAt(0)
    if (cc<32 || cc===127 || cc===255){
        return ' '
    } else {
        return c
    }
}
const checkEndian = (dict) => {
    const ts = readAscii(dict[TRANSFER_SYNTAX][2],0,dict[TRANSFER_SYNTAX][1])
            .split('').map(charChange).join('')

    if (ts.trim() === '1.2.840.10008.1.2.1'){
        LE = true
    } else if (ts.trim() === '1.2.840.10008.1.2.2'){
        LE = false
    } else {
        console.log("ERROR: Transfer Syntax value = "+ts+" length:"+ts.length)
    }
    const prV = new DataView(dict[PIXEL_REPRESENTATION][2].buffer)
    const pr = readUint16(prV,dict[PIXEL_REPRESENTATION][1])
    if (pr == 1){
        PIXEL = 'US'
    } else if (pr == 0){
        PIXEL = 'SS'
    } else{
        console.log("ERROR: Pixel Representation value = "+pr)
    }
}

const preapare = (dict) =>{
  checkEndian(dict)
  let values = {}
  tags.forEach(tag => {
    const data = dict[tag]
    if (data){
      const vr = data[0]
      const len = data[1]
      const bValue = data[2]
      if (tag === 'x7fe0,10'){
        const value = (changeFormat(PIXEL, len, bValue)).split(',')
        const pic = value.map(px => parseInt(px.trim(), 10))
        values[tag] = pic
      } else {
        const value = (tag,vr,changeFormat(vr, len, bValue))
        values[tag] = value
      }
    }
  })
  return values
}

export default preapare