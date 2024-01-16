import { useEffect, useRef, useState } from "react"
import styles from './image.css'

export default function Image(props){
    const picture = props.picture
    const X=props.X
    const Y=props.Y
    const rows=props.rows
    const cols=props.cols
    const pics=props.pics
    const windowCenter=props.windowCenter
    const windowWidth=props.windowWidth
    const scale=props.scale
    const slope=props.slope
    const intercept=props.intercept
    const view=props.view
    const [pic, setPic] = useState(Math.round(pics/2))

    const handleChangePic = (event) => {
        const value = event.target.value
        const intValue = parseInt(value, 10) 
        setPic(intValue)
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
    return <div class="col"><div class={`${styles.row-pic} row`}><canvas ref={canvasRef} /></div>
            <div class="row">
                <button type="button" class="btn btn-secondary" onClick={() => changePic(0)}>prev</button>
                <button type="button" class="btn btn-secondary" onClick={() => changePic(1)}>next</button>
            </div>
            <div class="row">
                {/* <label for="pic" class="form-label"></label> */}
                <input type="range" class="form-range" min="0" max={pics-1} id="pic" 
            onClick={(e) => handleChangePic(e)}/></div></div>
}