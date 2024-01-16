import { useState } from "react"
import Image from "./Image"


export default function Images(props) {
    const picture = props.picture
    const pixX = props.parameters['pixelSpacingX']
    const pixY = props.parameters['pixelSpacingY']
    const pixZ = props.parameters['pixelSpacingZ']
    const X = props.parameters['rows']
    const Y = props.parameters['cols']
    const slope = props.parameters['rescaleSlope']
    const intercept = props.parameters['rescaleIntercept']
    const Z = picture.length/(X*Y)
    const [windowCenter, setWindowCenter] = useState(props.parameters['windowCenter'])
    const [windowWidth, setWindowWidth] = useState(props.parameters['windowWidth'])

    const setStart = () => {
        console.log(props.parameters)
        setWindowCenter(props.parameters['windowCenter'])
        setWindowWidth(props.parameters['windowWidth'])
    }

    return(<>
        {props.picture.length !== 0 ? <div class="container"><div class="row align-items-stretch">
            <Image
                X={X}
                Y={Y}
                rows={Y}
                cols={X}
                pics={Z}
                windowCenter={windowCenter}
                windowWidth={windowWidth}
                scale={Math.floor(pixY/pixX)}
                slope={slope}
                intercept={intercept}
                view = "Top"
                picture = {props.picture}
            />
            <Image
                X={X}
                Y={Y}
                rows={Z}
                cols={Y}
                pics={X}
                windowCenter={windowCenter}
                windowWidth={windowWidth}
                scale={Math.floor(pixZ/pixY)}
                slope={slope}
                intercept={intercept}
                view = "Side"
                picture = {props.picture}/>
            <Image
                X={X}
                Y={Y}
                rows={Z}
                cols={X}
                pics={Y}
                windowCenter={windowCenter}
                windowWidth={windowWidth}
                scale={Math.floor(pixZ/pixX)}
                slope={slope}
                intercept={intercept}
                view = "Front"
                picture = {props.picture}/>
            </div></div>:<></>}

        <button type="button" class="btn btn-secondary" onClick={()=>setStart()}>WW WL - initial</button>
        <label for="width" class="form-label">window width</label>
        <input type="range" class="form-range" min="0" max="16384" id="width" 
            onClick={(e) => setWindowWidth(e.target.value)}/>
        <label for="center" class="form-label">window center</label>
        <input type="range" class="form-range" min="-3000" max="3000" id="center" 
            onClick={(e) => setWindowCenter(e.target.value)}/>
    </>)
}