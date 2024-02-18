import React, { useState } from 'react';

function Blob() {
    const [imgs, setImgs] = useState()

    const handlechange = (e) => {
        console.log(e.target.files)
        const data = new FileReader();
        data.addEventListener('load', ()=>{
            setImgs(data.result)
        })
        data.readAsDataURL(e.target.files[0]);
    }

    console.log(imgs);

    return (
        <div>
            <input type="file" onChange={handlechange} />
            <img src={imgs} height={'200px'} width={'200px'} alt=''/>
        </div>
    )
}

export default Blob;
