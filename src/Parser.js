import { useEffect, useState } from 'react';
import parseDicom from './pars';
import preapare from './dataPrepare';

export default function Parser (props){

    const parameters = {
        rows: 0,
        cols: 0,
        pixelSpacingX: 0,
        pixelSpacingY: 0,
        pixelSpacingZ: 0,
        windowCenter: 0,
        windowWidth: 0,
        rescaleIntercept: 0,
        rescaleSlope: 0
    }
    const picturePosition = []
    const makeParameters = (data) => {
        parameters['rows'] = parseInt(data['x28,10'],10)
        parameters['cols'] = parseInt(data['x28,11'],10)
        const pixelSpacing = data['x28,30'].split('\\')
        parameters['pixelSpacingX'] = parseFloat(pixelSpacing[0])
        parameters['pixelSpacingY'] = parseFloat(pixelSpacing[1])
        parameters['pixelSpacingZ'] = data['x18,50'] ? parseFloat(data['x18,50']) : parseFloat(data['x18,88'] )
        parameters['windowCenter'] = parseInt(data['x28,1050'],10)
        parameters['windowWidth'] = parseInt(data['x28,1051'],10)
        parameters['rescaleIntercept'] = parseInt(data['x28,1052'],10)
        parameters['rescaleSlope'] = parseInt(data['x28,1053'],10)
        props.setParameters(parameters)
    }
    const makePicture = (data) => {
        let temPic = []
        data.forEach(ele => {
            console.log(ele['x20,13'])
            const pos = ele['x20,32'].split('\\')
            picturePosition.push({x:pos[0],y:pos[1],z:pos[2]})
            const temp = ele['x7fe0,10']
            temPic = temPic.concat(temp)
        })
        return temPic
    }

    const handleFolderChange = async () => {
        const files = []
        const dirHandle = await window.showDirectoryPicker()
        
        for await (const fileHandle of dirHandle.values()) {
          const reader = new FileReader()
          const file = await fileHandle.getFile()
          
          const loadedFile = await new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsArrayBuffer(file)
          })
          
          const fileContent = new Uint8Array(loadedFile)
          
          if (ifDICOM(fileContent)) {
            const dataDICOM = fileContent.slice(132, fileContent.length)
            const dict = parseDicom(dataDICOM)
            const data = preapare(dict)
            files.push(data)
          }
        }
        
        return files
      }
    
    const startPars = async() =>{
        const data = await handleFolderChange()
        const dataSorted = data.sort((a, b) => {
            return parseInt(a['x20,13']) - parseInt(b['x20,13']);
          });
        makeParameters(dataSorted[0])
        const pic = makePicture(dataSorted)
        props.setPicture(pic)
    }


    const ifDICOM = (file) => {
        const dicomHeader = file.slice(0,132)
        const dicomHeaderString = String.fromCharCode.apply(null, dicomHeader)
        return dicomHeaderString.indexOf("DICM") === 128
    }


    return(
        <>
            <button type="button" class="btn btn-secondary" onClick={startPars}>Wybierz folder</button>
        </>
    )
}