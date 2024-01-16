import { useEffect, useRef, useState } from "react"


export default function ImageCanvas(props) {
    const picture = props.picture
    const pixX = props.parameters['pixelSpacingX']
    const pixY = props.parameters['pixelSpacingY']
    const pixZ = props.parameters['pixelSpacingZ']
    const X = props.parameters['rows']
    const Y = props.parameters['cols']
    let slope = props.parameters['rescaleSlope']
    let intercept = props.parameters['rescaleIntercept']
    const Z = picture.length/(X*Y)
    // const windowWidth = props.parameters['windowWidth']
    const [pic,setPic] = useState(0)
    const [rows,setRows] = useState(X)
    const [cols,setCols] = useState(Y)
    const [pics, setPics] = useState(Z)
    const [view, setView] = useState('Top')
    const [scale, setScale] = useState(Math.floor(pixY/pixX))
    const [windowCenter, setWindowCenter] = useState(props.parameters['windowCenter'])
    const [windowWidth, setWindowWidth] = useState(props.parameters['windowWidth'])

    const setStart = () => {
        setWindowCenter(props.parameters['windowCenter'])
        setWindowWidth(props.parameters['windowWidth'])
    }

    const changePic=(v) =>{
        if(v){
            if (pic === pics-1){
                setPic(0)
            } else {
                setPic(pic+1)
            }
        } else {
            if (pic === 0){
                setPic(pics-1)
            } else {
                setPic(pic-1)
            }
        }

    }

    const changeView = (view) =>{
        switch(view) {
            case 'Top':
                setRows(Y)
                setCols(X)
                setPics(Z)
                setScale(Math.floor(pixY/pixX))
                break
            case 'Side':
                setRows(Z)
                setCols(Y)
                setPics(X)
                setScale(Math.floor(pixZ/pixY))
                break
            case 'Front':
                setRows(Z)
                setCols(X)
                setPics(Y)
                setScale(Math.floor(pixZ/pixX))
                break
            default:
                setRows(X)
                setCols(Y)
                setPics(Z)
                setScale(Math.floor(pixY/pixX))
            
        }
    }
    useEffect(()=>{
        changeView(view)
        setPic(Math.round(pics/2))
    },[X,Y,Z,view])

    const CanvaPrepare = () => {

        const canvasRef = useRef(null)
        useEffect(() =>{
            const canvas = canvasRef.current
            const context = canvas.getContext('2d')
            canvas.width = cols
            canvas.height = rows*scale
            if (view==='Top'){
                for (let y = 0; y < rows; y++) {
                    for (let x = 0; x < cols; x++) {
                        let pixelValue = 255
                        const pixel = slope*picture[x+ y * Y  + Y*X*pic]+intercept
                        if (pixel <= (windowCenter - windowWidth)){
                            pixelValue = 0
                        } else if (pixel >= (windowWidth + windowCenter)){
                            pixelValue = 255
                        } else {
                            pixelValue =Math.round((pixel-(windowCenter - windowWidth))/(2*windowWidth)*255)
                        }
                        context.fillStyle = `rgb(${pixelValue}, ${pixelValue}, ${pixelValue})`
                        context.fillRect(x, y*scale, 1, scale)
                    }
                }
            } else if (view==='Side'){
                for (let y = 0; y < rows; y++) {
                    for (let x = 0; x < cols; x++) {
                        let pixelValue = 255
                        const pixel = slope*picture[pic+ x * Y  + Y*X*y]+intercept
                        if (pixel <= (windowCenter - windowWidth)){
                            pixelValue = 0
                        } else if (pixel >= (windowWidth + windowCenter)){
                            pixelValue = 255
                        } else {
                            pixelValue =Math.round((pixel-(windowCenter - windowWidth))/(2*windowWidth)*255)
                        }
                        context.fillStyle = `rgb(${pixelValue}, ${pixelValue}, ${pixelValue})`
                        context.fillRect((cols-x), (rows-y)*scale, 1, scale)
                    }
                }
            } else {
                for (let y = 0; y < rows; y++) {
                    for (let x = 0; x < cols; x++) {
                        let pixelValue = 255
                        const pixel = slope*picture[x+ pic * Y  + Y*X*y]+intercept
                        if (pixel <= (windowCenter - windowWidth)){
                            pixelValue = 0
                        } else if (pixel >= (windowWidth + windowCenter)){
                            pixelValue = 255
                        } else {
                            pixelValue =Math.round((pixel-((windowCenter - windowWidth)/2))/(windowWidth)*255)
                        }
                        context.fillStyle = `rgb(${pixelValue}, ${pixelValue}, ${pixelValue})`                     
                        context.fillRect((cols-x), (rows-y)*scale, 1, scale)
                    }
                }
            }
        }, [picture,rows,cols,pic,windowWidth,windowCenter])
        return <canvas ref={canvasRef} />
    }

    return(<>
        {props.picture.length !== 0 ? <><CanvaPrepare/></>:<></>}
        <div>
            <button type="button" class="btn btn-secondary" onClick={() => changePic(0)}>prev</button>
            <button type="button" class="btn btn-secondary" onClick={() => changePic(1)}>next</button>
            <button type="button" class="btn btn-secondary" onClick={() => setView('Top')}>Top</button>
            <button type="button" class="btn btn-secondary" onClick={() => setView('Side')}>Side</button>
            <button type="button" class="btn btn-secondary" onClick={() => setView('Front')}>Front</button>
        </div>
        <button type="button" class="btn btn-secondary" onClick={()=>setStart()}>WW WL - initial</button>
        <label for="pic" class="form-label">Picture</label>
        <input type="range" class="form-range" min="0" max={pics-1} id="pic" 
            onClick={(e) => setPic(e.target.value)}/>
        <label for="width" class="form-label">window width</label>
        <input type="range" class="form-range" min="0" max="16384" id="width" 
            onClick={(e) => setWindowWidth(e.target.value)}/>
        <label for="center" class="form-label">window center</label>
        <input type="range" class="form-range" min="-3000" max="3000" id="center" 
            onClick={(e) => setWindowCenter(e.target.value)}/>
    </>)
}