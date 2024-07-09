import React, {useState} from 'react'
import {Link, Redirect} from 'react-router-dom';
import ShowImage from './ShowImage';
import moment from 'moment';
import {addItem, updateItem, removeItem} from './cartHelpers';

const Card = ({product, showViewProductButton = true, showAddToCartButton = true, 
    cartUpdate = false, showRemoveProductButton = false, setRun = f => f, run=undefined }) => {

    const [redirect, setRedirect] = useState(false);
    const [count, setCount] = useState(product.count);
    const [loading, setLoading] = useState(false); // Loader state

    const showViewButton = (showViewProductButton) => {
        return (
            showViewProductButton && (
                <Link to ={`/product/${product._id}`} className="mr-2">
                    <button className="btn btn-outline-primary mt-2 mb-2 mr-2">
                        View Product
                    </button>    
                </Link>
            )
        )
    }

    const addToCart = () => {
        addItem(product, () => {
            setRedirect(true);
        })
    }

    const shouldRedirect = redirect => {
        if(redirect)
        {
            return <Redirect to = '/cart' />
        }
    }

    const showAddToCart = (showAddToCartButton) => {
        return (
            showAddToCartButton && <button onClick={addToCart} className="btn btn-outline-warning mt-2 mb-2 mr-2">
                Add to Cart
            </button>
        )
    }

    const showRemoveButton = showRemoveProductButton => {
        return (
          showRemoveProductButton && (
            <button
              onClick={() => {
                removeItem(product._id);
                setRun(!run); // run useEffect in parent Cart
              }}
              className="btn btn-outline-danger mt-2 mb-2"
            >
              Remove Product
            </button>
          )
        );
      };

    const showStock = (quantity) => {
        return quantity > 0 ? 
            <span className="badge badge-primary badge-pill">In Stock</span> 
            : <span className="badge badge-danger badge-pill">Out of Stock</span>
    }

    const handleChange = productId => event => {
        setRun(!run);
        setCount(event.target.value < 1 ? 1 : event.target.value);
        if (event.target.value >= 1) {
            updateItem(productId, event.target.value);
        }
    };


    const showCartUpdateOptions = cartUpdate => {
        return cartUpdate && <div>    
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text">Adjust Quantity</span>
                </div>
                <input type="number" value={count} className="form-control" onChange={handleChange(product._id)} />
            </div>
        </div>
    }

    const openPDF = () => {
        setLoading(true); // Start loading
        fetch(`/api/product/pdf/${product._id}`, {
            method: 'GET',
            headers: {
                Accept: 'application/pdf',
            },
        })
        .then(response => {
            if (!response.ok) {
                setLoading(false); // Stop loading
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            const url = URL.createObjectURL(blob);
            // console.log(url)
            const a = document.createElement('a');
            a.href = url;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setLoading(false); // Stop loading in case of error
        })
        .catch(err => {
            setLoading(false); // Stop loading in case of error
            alert("Error fetching or opening PDF:", err)
            console.error('Error fetching or opening PDF:', err);
            // Handle error (e.g., show error message)
        });
    };
    

    const showOpenPDFButton = () => {
        if (product.pdfFile && product.pdfFile.data) {
            // Conditionally enable button if PDF exists
            return (
                <button
                    onClick={openPDF}
                    className="btn btn-outline-success mt-2 mb-2"
                    disabled={loading}
                    style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                    {loading ? 'Loading...' : 'Open PDF'}
                </button>
            );
        } else {
            // Disable button if no PDF
            return (
                <button
                    className="btn btn-outline-danger mt-2 mb-2"
                    disabled
                    style={{ cursor: 'not-allowed' }}
                >
                    No PDF Available
                </button>
            );
        }
    };
    
    return (
            <div className="card">
                <div className="card-header name text-center">{product.name}</div>
                <div className="card-body">
                    {shouldRedirect(redirect)}
                    <ShowImage item={product} url="product" />
                    
                    <p className = "mt-2">{product.description}</p>
                    <p className = "font-weight-bold">Rs. {product.price}</p>
                    <p className = "black-10">Category: {product.category && product.category.name}</p>
                    <p className = "black-10">Category: {product.pdfUrl && product.pdfUrl}</p>
                    <p className = "black-8">Added {moment(product.createdAt).fromNow()}</p>

                    {showStock(product.quantity)}
                    <br />
                    {showViewButton(showViewProductButton)}
                    
                    {showRemoveButton(showRemoveProductButton)}

                    {showAddToCart(showAddToCartButton)}
                    
                    {showCartUpdateOptions(cartUpdate)}

                    {showOpenPDFButton()}
                    
                </div>
            </div>
            
    )
}

export default Card
