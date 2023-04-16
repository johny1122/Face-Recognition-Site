import React from 'react';
import './FaceRecognition.css';


const createFacesDivs = (boxes) => {
    const facesDivs = [];
    for (let i = 0; i < boxes.length; i++) {
        facesDivs.push(
            <div key={i} className='bounding-box'
                style={{top: boxes[i].top_row,
                        bottom: boxes[i].bottom_row,
                        left: boxes[i].left_col,
                        right: boxes[i].right_col
                        }}>
            </div>
        );
    }
    return facesDivs;
}

const FaceRecognition = ( {boxes, imageUrl} ) => {
    return (
        <div className='center'>
            <div className='absolute mt2' id='div_of_image'>
                <img 
                id='inputImage'
                alt=''
                src={imageUrl}
                height='auto'
                width='500px'
                />
                {createFacesDivs(boxes)}
            </div>
        </div>
    );
}

export default FaceRecognition;