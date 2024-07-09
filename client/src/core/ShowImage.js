import React from 'react'

const ShowImage = ({item, url}) => {
    return (
        <div className="product-img">
            <img src={`/api/${url}/photo/${item._id}`} alt={item.name} className="mb-3" 
                style={{
                    // maxHeight:"100%",
                    // maxWidth: "100%"
                    width: "100%",
                    height: "500px", /* Adjust height as needed */
                    objectFit: "contain",
                }}/>
        </div>
    )
}

export default ShowImage
